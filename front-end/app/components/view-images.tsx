import { useState, useEffect, useCallback } from 'react';
import { Dropzone, ExtFile } from '@dropzone-ui/react';
import PhotoAlbum, { ClickHandlerProps, Photo } from 'react-photo-album';

interface UploadcareFileMetadata {
  uuid: string
  datetime_uploaded: string
  original_file_url: string
}

interface UploadcareGetFilesResponse {
  next?: string | null
  results: UploadcareFileMetadata[]
}

export default function ViewImages() {
  const UPLOADCARE_PUBLIC_KEY = '';
  const UPLOADCARE_SECRET_KEY = '';
  const pageLimit = 3;
  const initialFetchUrl = `https://api.uploadcare.com/files/?limit=${pageLimit}&ordering=-datetime_uploaded`;
  const [images, setImages] = useState<Array<Photo & { id: string }>>([]);
  const [nextFetchUrl, setNextFetchUrl] = useState<string | undefined | null>(undefined);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<ExtFile[]>([]);

  const fetchImages = async (url: string): Promise<UploadcareGetFilesResponse> => {
    setLoading(true);

    console.log('Making fetch request', { url });

    // replace with service call
    const response = await fetch(url, {
      headers: {
        'Authorization': `Uploadcare.Simple ${UPLOADCARE_PUBLIC_KEY}:${UPLOADCARE_SECRET_KEY}`,
        'Accept': 'application/vnd.uploadcare-v0.5+json'
      }
    });

    if (response.status !== 200) {
      setLoading(false);
      throw new Error('Error encountered while fetching images');
    }
    
    const data = await response.json();

    setLoading(false);
    
    return data as UploadcareGetFilesResponse;
  };

  useEffect(() => {
    const loadInitalImages = async () => {
      try {
        const { next, results } = await fetchImages(initialFetchUrl);
  
        if (results.length) {
          setImages(
            (prevImages) => [
              ...prevImages,
              ...results
              // ugly workaround for useEffect getting called twice on mount when strict mode is enabled
              .filter(
                (image) => 
                  !prevImages.some(prev => prev.src === image.original_file_url)
              )
              .map(
                (file) => ({
                  id: file.uuid,
                  src: file.original_file_url,
                  width: 800,
                  height: 600
                })
              )
            ]
          );
        }
  
        setNextFetchUrl(next);
      } catch (error) {
        console.log(`Error encountered while fetching images`, { error });
      }
    };

    loadInitalImages();
  }, []);

  const loadImages = async () => {
    if (hasMore) {
      try {
        const { next, results } = await fetchImages(nextFetchUrl!);

        if (results.length) {
          setImages(
            (prevImages) => [
              ...prevImages,
              ...results.map(
                (file) => ({
                  id: file.uuid,
                  src: file.original_file_url,
                  width: 800,
                  height: 600
                })
              )
            ]
          );
        }

        setNextFetchUrl(next);
      } catch (error) {
        console.log(`Error encountered while fetching images`, { error });
      }
    }
  };

  useEffect(() => {
    setHasMore(Boolean(nextFetchUrl));
  }, [nextFetchUrl]);

  useEffect(() => {
    if (uploadedFiles.length) {
      setLoading(true);
      //POST file to API
      setImages(
        (prevImages) => [
          // {
          //   id,
          //   src: fileUrl,
          //   width: 800,
          //   height: 600
          // },
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

  const handleImageClicked = useCallback(async ({ photo }: ClickHandlerProps<Photo & { id: string }>) => {
    console.log('image clicked', { photo });
  }, []);

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
        {hasMore && !loading && (
          <button onClick={loadImages}>Load More</button>
        )}
    </div>
  );
}
