import { Dropzone, ExtFile } from '@dropzone-ui/react';
import { useState, useEffect, useCallback } from 'react';
import PhotoAlbum, { ClickHandlerProps } from 'react-photo-album';
import {
  fetchImages as fetchImagesFromApi,
  postImage as postImageToApi,
  deleteImage as deleteImageFromApi
} from '../utils';
import { IdentifyablePhoto, ImageMetadata } from '../models';
import ViewImage from './view-image';

export default function ViewImages() {
  const pageLimit = 10;
  const imageWidth = 800;
  const imageHeight = 600;
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<IdentifyablePhoto[]>([]);
  const [uploadedImages, setUploadedImages] = useState<ExtFile[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [targetImage, setTargetImage] = useState<IdentifyablePhoto | null>(null);

  const mapFileApiModelToFileViewmodel = (apiModel: ImageMetadata): IdentifyablePhoto => {
    const { id, imageContentUrl: src } = apiModel;

    return {
      id,
      src,
      width: imageWidth,
      height: imageHeight
    };
  };

  const fetchImages = useCallback(async (pageRequest: {
    limit: number
    offset?: number
  }): Promise<ImageMetadata[]> => {
    try {
      return await fetchImagesFromApi(pageRequest);
    } catch (error) {
      return [];
    }     
  }, []);

  const loadImages = useCallback(async () => {
    setLoading(true);

    const newImages = await fetchImages({
      limit: pageLimit,
      offset: (pageNumber - 1) * pageLimit
    });

    setImages(newImages.map(mapFileApiModelToFileViewmodel));

    setHasPrevious(pageNumber > 1);

    setHasNext(newImages.length === pageLimit);

    setLoading(false);
  }, [setLoading, setImages, fetchImages, pageNumber]);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  useEffect(() => {
    const handleUploadChange = async () => {
      setLoading(true);

      if (uploadedImages.length) {
        const [uploadedImage] = uploadedImages;

        const { file: imageFile } = uploadedImage;

        if (imageFile) {
          try {
            await postImageToApi(imageFile);

            setPageNumber(1);

            loadImages();
          } catch (error) {
            console.log('An error occurred while uploading the image', { error });
          }
        }
        
        setUploadedImages([]);
      }

      setLoading(false);
    };
    
    handleUploadChange();
  }, [uploadedImages]);

  const handleUploadComplete = useCallback((newlyUploadedImages: ExtFile[]) => {
    const [newlyUploadedImage] = newlyUploadedImages;

    setUploadedImages([newlyUploadedImage]);
  }, []);

  const handleImageClicked = useCallback(async ({ photo }: ClickHandlerProps<IdentifyablePhoto>) => {
    setTargetImage(photo);
    setModalOpen(true);
  }, []);

  const handlePreviousClicked = useCallback(async () => {
    if (hasPrevious) setPageNumber(pageNumber - 1);
  }, [hasPrevious, setPageNumber]);

  const handleNextClicked = useCallback(async () => {
    if (hasNext) setPageNumber(pageNumber + 1);
  }, [hasNext, setPageNumber]);

  const imageDeleteCallback = useCallback(async (imageId: string) => {
    await deleteImageFromApi(imageId);
    setPageNumber(1);
    loadImages();
  }, []);

  const modalCloseCallback = useCallback(() => {
    setModalOpen(false);
    setTargetImage(null);
  }, []);

  return (
    <div className='content-wrapper'>
      {modalOpen && targetImage ? (
        <div className='content-wrapper centered-wrapper'>
          <ViewImage image={targetImage} closeCallback={modalCloseCallback} deleteCallback={imageDeleteCallback} />
        </div>
      ) : (
        <div className='content-wrapper'>
          <div className='centered-wrapper'>
            <h1>Image Gallery</h1>
          </div>
          <div className='content-wrapper'>
            <PhotoAlbum layout='masonry' photos={images} onClick={handleImageClicked} />
          </div>
          <div className='right-justify content-wrapper even-spacing'>
            {loading && <p>Loading...</p>}
            {hasPrevious && !loading && (
              <button onClick={handlePreviousClicked}>Previous</button>
            )}
            {hasNext && !loading && (
              <button onClick={handleNextClicked}>Next</button>
            )}
          </div>
          <div className='content-wrapper'>
            <Dropzone
              onChange={handleUploadComplete}
              maxFiles={1}
              value={uploadedImages}
              accept={'image/jpeg, image/jpg, image/png'}
              behaviour={'replace'}
            />
          </div>
        </div>
      )}
    </div>
  );
}