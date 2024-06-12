import { useState, useEffect, useCallback } from 'react';
import { Dropzone, ExtFile } from '@dropzone-ui/react';
import PhotoAlbum, { ClickHandlerProps, Photo } from 'react-photo-album';
import { fetchImages as fetchImagesFromApi } from '../utils';
import { GetImagesResponse, ImageMetadata } from '../models';

interface IdentifyablePhoto extends Photo { 
  id: string
}

export default function ViewImages() {
  const imageWidth = 800;
  const imageHeight = 600;
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<IdentifyablePhoto[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<ExtFile[]>([]);
  const [previousPageUrl, setPreviousPageUrl] = useState<string | null>(null);
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);

  const mapFileApiModelToFileViewmodel = (apiModel: ImageMetadata): IdentifyablePhoto => {
    const { imageId: id, imageContentUrl: src } = apiModel;

    return {
      id,
      src,
      width: imageWidth,
      height: imageHeight
    };
  };

  const fetchImages = useCallback(async (fetchUrl?: string): Promise<GetImagesResponse> => {
    try {
      return await fetchImagesFromApi(fetchUrl);
    } catch (error) {
      return {
        data: [],
        previous: null,
        next: null
      }
    }     
  }, []);

  useEffect(() => {
    const loadInitalImages = async () => {
      setLoading(true);

      const { data, next } = await fetchImages();

      setImages(
        data.map(mapFileApiModelToFileViewmodel)
      );
      
      setNextPageUrl(next);

      setLoading(false);
    };

    loadInitalImages();
  }, [fetchImages]);

  const loadImages = useCallback(async (fetchUrl: string) => {
    setLoading(true);

    const { data: newImages, previous, next } = await fetchImages(fetchUrl);

    setImages(newImages.map(mapFileApiModelToFileViewmodel));

    setPreviousPageUrl(previous);

    setNextPageUrl(next);

    setLoading(false);
  }, [setLoading, setImages, fetchImages]);

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
    if (previousPageUrl) await loadImages(previousPageUrl);
  }, [previousPageUrl, loadImages]);

  const handleNextClicked = useCallback(async () => {
    if (nextPageUrl) await loadImages(nextPageUrl);
  }, [nextPageUrl, loadImages]);

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
        {Boolean(previousPageUrl) && !loading && (
          <button onClick={handlePreviousClicked}>Previous</button>
        )}
        {Boolean(nextPageUrl) && !loading && (
          <button onClick={handleNextClicked}>Next</button>
        )}
    </div>
  );
}
