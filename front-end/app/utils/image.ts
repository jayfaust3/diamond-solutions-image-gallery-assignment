import { GetImagesResponse, ImageMetadata, PostImageResponse } from '../models';

const imageApiUrl = '/image-api';

export const fetchImages = async (pageRequest: {
    limit: number
    offset?: number
}): Promise<ImageMetadata[]> => {
    const { limit, offset } = pageRequest;

    let requestUrl = `${imageApiUrl}?limit=${limit}`;

    if (offset) requestUrl += `&offset=${offset}`;

    const response = await fetch(requestUrl, {
        method: 'GET',
    });

    const responseJson = await response.json();

    const { data } = responseJson as GetImagesResponse;

    return data;
};

export const postImage = async (imageFile: File): Promise<ImageMetadata> => {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await fetch(imageApiUrl, {
        method: 'POST',
        body: formData,
    });

    const responseJson = await response.json();

    const { data } = responseJson as PostImageResponse;

    return data;
};

export const deleteImage = async (imageId: string): Promise<void> => {
    const deleteUrl = `${imageApiUrl}/${imageId}`
    
    await fetch(deleteUrl, {
        method: 'DELETE'
    });
};
