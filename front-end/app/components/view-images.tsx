import { useState, useEffect, useCallback } from 'react';
import { Dropzone, ExtFile } from '@dropzone-ui/react';
import PhotoAlbum, { ClickHandlerProps, Photo } from 'react-photo-album';
import { fetchImages as fetchImagesFromApi } from '../utils';
import { ImageMetadata } from '../models';

interface IdentifyablePhoto extends Photo { 
  id: string
}

export default function ViewImages() {
  const imageWidth = 800;
  const imageHeight = 600;
  const pageLimit = 3;
  const [pageNumber, setPageNumber] = useState(1);
  const [images, setImages] = useState<IdentifyablePhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<ExtFile[]>([]);

  const mapFileApiModelToFileViewmodel = (apiModel: ImageMetadata): IdentifyablePhoto => {
    const { imageId: id, imageContentUrl: src } = apiModel;

    return {
      id,
      src,
      width: imageWidth,
      height: imageHeight
    };
  };

  const fetchImages = useCallback(async (page: number): Promise<IdentifyablePhoto[]> => {
    let fetchedImages: IdentifyablePhoto[] = [];

    try {
      const imagesFromApi: ImageMetadata[] = await fetchImagesFromApi(pageLimit, page);

      fetchedImages = imagesFromApi.map(mapFileApiModelToFileViewmodel);
    } catch (error) {
      console.log('Encountered an error while fetching images', { error });
    } 
    
    return fetchedImages;
  }, []);

  useEffect(() => {
    const loadInitalImages = async () => {
      setLoading(true);

      const initalImages: IdentifyablePhoto[] = await fetchImages(1);

      setImages(
        // annoying workaround for the page loading twice locally when strict mode is enabled
        initalImages.filter(
          (newImage) => 
            !images.some(
              existingImage =>
                existingImage.id === newImage.id
            )
        )
      );
        
      setLoading(false);
    };

    loadInitalImages();
  }, []);

  const loadImages = useCallback(async (page: number) => {
    setLoading(true);

    const newImages: IdentifyablePhoto[] = await fetchImages(page);

    setImages(newImages);
        
    setLoading(false);
  }, [setLoading, setImages, fetchImages]);

  useEffect(() => {
    setHasNext(images.length === pageLimit);
  }, [images]);

  useEffect(() => {
    setHasPrevious(pageNumber > 1);
  }, [pageNumber]);

  useEffect(() => {
    if (uploadedFiles.length) {
      setLoading(true);
      //POST file to API
      setImages(
        (prevImages) => [
          // newImage,
          ...prevImages
        ]
      );
      setUploadedFiles([]);
      setLoading(false);
    }
  }, [uploadedFiles]);

  // update file collection, let observation functionality post and update images
  const handleUploadComplete = useCallback((newlyUploadedFiles: ExtFile[]) => {
    const [uploadedFile] = newlyUploadedFiles;

    setUploadedFiles([uploadedFile]);
  }, []);

  const handleImageClicked = useCallback(async ({ photo }: ClickHandlerProps<IdentifyablePhoto>) => {
    setLoading(true);
    console.log('image clicked', { photo });
    setLoading(false);
  }, []);

  const handlePreviousClicked = useCallback(async () => {
    if (hasPrevious) {
      const newPageNumber = pageNumber - 1;
      await loadImages(newPageNumber);
      setPageNumber(newPageNumber);
    }
    
  }, [hasPrevious, pageNumber, loadImages]);

  const handleNextClicked = useCallback(async () => {
    if (hasNext) {
      const newPageNumber = pageNumber + 1;
      await loadImages(newPageNumber);
      setPageNumber(newPageNumber);
    }
  }, [hasNext, pageNumber, loadImages]);

  return (
    <div>
      <h1>Image Gallery</h1>
      <Dropzone 
        onChange={handleUploadComplete}
        maxFiles={1}
        value={uploadedFiles}
        accept={'image/jpeg, image/jpg, image/png'}
        behaviour={'replace'}
      />
      <div className="gallery">
        <PhotoAlbum layout="rows" photos={images} onClick={handleImageClicked}/>
      </div>
        {loading && <p>Loading...</p>}
        {hasPrevious && !loading && (
          <button onClick={handlePreviousClicked}>Previous</button>
        )}
        {hasNext && !loading && (
          <button onClick={handleNextClicked}>Next</button>
        )}
    </div>
  );
}
