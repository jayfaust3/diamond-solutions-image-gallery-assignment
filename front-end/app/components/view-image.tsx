import { useState, useCallback } from 'react';
import PhotoAlbum, { Photo } from 'react-photo-album';

interface IdentifyablePhoto extends Photo { 
  id: string
}

export default function ViewImage(props: {
    image: IdentifyablePhoto
    closeCallback: () => void
}) {
    const {image, closeCallback } = props;

  const [imageData] = useState(image);

  const handleCloseClicked = useCallback(() => {
    closeCallback();
  }, [closeCallback]);

  return (
    <div>
        <div>
            <PhotoAlbum layout="rows" photos={[imageData]}/>
        </div>
        <button onClick={handleCloseClicked}>Close</button>
    </div>
  );
}
