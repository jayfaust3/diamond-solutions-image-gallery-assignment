import { useState, useCallback } from 'react';
import PhotoAlbum, { Photo } from 'react-photo-album';

interface IdentifyablePhoto extends Photo { 
  id: string
}

export default function ViewImage(props: {
    image: IdentifyablePhoto
    closeCallback: () => void
    deleteCallback: (imageId: string) => Promise<void>
}) {
  const {image, closeCallback, deleteCallback } = props;

  const [imageData] = useState(image);

  const handleCloseClicked = useCallback(() => {
    closeCallback();
  }, [closeCallback]);

  const handleDeleteClicked = useCallback(async () => {
    await deleteCallback(imageData.id);

    closeCallback();
  }, [closeCallback, deleteCallback, imageData]);

  return (
    <div>
        <div>
            <PhotoAlbum layout="rows" photos={[imageData]}/>
        </div>
        <div>
          <button onClick={handleDeleteClicked}>Delete</button>
          <button onClick={handleCloseClicked}>Close</button>
        </div>
    </div>
  );
}
