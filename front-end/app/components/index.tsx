import { useState, useEffect, useCallback } from 'react';
import { FileInfo, Widget } from '@uploadcare/react-widget';
import PhotoAlbum, { Photo } from 'react-photo-album';

interface UploadcareFileMetadata {
  datetime_uploaded: string
  original_file_url: string
}

interface UploadcareGetFilesResponse {
  next?: string | null
  results: UploadcareFileMetadata[]
}

export default function Index() {
  const UPLOADCARE_PUBLIC_KEY = '';
  const UPLOADCARE_SECRET_KEY = '';
  const pageLimit = 25;
  const initialFetchUrl = `https://api.uploadcare.com/files/?limit=${pageLimit}&ordering=-datetime_uploaded`;
  const [images, setImages] = useState<Photo[]>([]);
  const [nextFetchUrl, setNextFetchUrl] = useState<string | undefined | null>(undefined);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchImages = async (url: string): Promise<UploadcareGetFilesResponse> => {
    setLoading(true);

    console.log('Making fetch request', { url });

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

  const loadInitalImages = useCallback(async () => {
    try {
      const { next, results } = await fetchImages(initialFetchUrl);

      if (results.length) {
        setImages(
          (prevImages) => [
            ...prevImages,
            ...results.map(
              (file) => ({
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
  }, []);

  useEffect(() => {
    loadInitalImages();
  }, [loadInitalImages]);

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

  const handleUploadComplete = useCallback((fileInfo: FileInfo) => {
    const fileUrl = fileInfo.cdnUrl;

    if (fileUrl) {
      setImages(
        (prevImages) => [
          {
            src: fileUrl,
            width: 800,
            height: 600
          },
          ...prevImages
        ]
      );
    }
  }, []);

  return (
    <div>
      <h1>Image Gallery</h1>
      <Widget
        publicKey={UPLOADCARE_PUBLIC_KEY}
        onChange={handleUploadComplete}
        data-crop="free"
      />
      <div className="gallery">
        <PhotoAlbum layout="rows" photos={images} />
      </div>
        {loading && <p>Loading...</p>}
        {hasMore && !loading && (
          <button onClick={loadImages}>Load More</button>
        )}
    </div>
  );
}
