import { useState, useEffect, useCallback } from 'react';
import { Dropzone, ExtFile } from '@dropzone-ui/react';
import PhotoAlbum, { ClickHandlerProps, Photo } from 'react-photo-album';
import { fetchImages as fetchImagesFromApi, postImage as postImageToApi } from '../utils';
import { ImageMetadata } from '../models';

interface IdentifyablePhoto extends Photo { 
  id: string
}

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

    setHasPrevious(pageNumber > 0);

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
    setLoading(true);
    console.log('image clicked', { photo });
    setLoading(false);
  }, []);

  const handlePreviousClicked = useCallback(async () => {
    if (hasPrevious) setPageNumber(pageNumber - 1);
  }, [hasPrevious, setPageNumber]);

  const handleNextClicked = useCallback(async () => {
    if (hasNext) setPageNumber(pageNumber + 1);
  }, [hasNext, setPageNumber]);

  return (
    <div>
      <h1>Image Gallery</h1>
      <Dropzone 
        onChange={handleUploadComplete}
        maxFiles={1}
        value={uploadedImages}
        accept={'image/jpeg, image/jpg, image/png'}
        behaviour={'replace'}
      />
      <div className="gallery">
        <PhotoAlbum layout="rows" photos={images} onClick={handleImageClicked}/>
      </div>
        {loading && <p>Loading...</p>}
        {Boolean(hasPrevious) && !loading && (
          <button onClick={handlePreviousClicked}>Previous</button>
        )}
        {Boolean(hasNext) && !loading && (
          <button onClick={handleNextClicked}>Next</button>
        )}
    </div>
  );
}
