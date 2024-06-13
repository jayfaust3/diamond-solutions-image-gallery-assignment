import { GetImagesResponse, ImageMetadata, PostImageResponse } from '../models';
import { HTTPClient } from './http';

const imageApiUrl = '/image-api';

export const fetchImages = async (pageRequest: {
    limit: number
    offset?: number
}): Promise<ImageMetadata[]> => {
    const httpClinet = new HTTPClient();

    const { limit, offset } = pageRequest;

    let requestUrl = `${imageApiUrl}?limit=${limit}`;

    if (offset) requestUrl += `offset=${offset}`

    const response = await httpClinet.makeRequest<GetImagesResponse>(
        'GET',
        requestUrl
    );

    const { data } = response;

    return data;
};

export const postImage = async (imageFile: File): Promise<ImageMetadata> => {
    const httpClinet = new HTTPClient()

    const response = await httpClinet.makeRequest<PostImageResponse>(
        'POST',
        imageApiUrl,
        {
            payload: imageFile
        }
    );

    const { data } = response;

    return data;
};