import FormData from 'form-data';
import { GetImagesResponse, ImageMetadata } from '../models';
import { HTTPClient } from './http';

interface UploadcareFileMetadata {
    uuid: string
    datetime_uploaded: string
    original_file_url: string
}
  
interface UploadcareGetFilesResponse {
    results: UploadcareFileMetadata[]
    previous: string | null
    next: string | null
}

const UPLOADCARE_PUBLIC_KEY = '';
const UPLOADCARE_SECRET_KEY = '';
const PAGE_LIMIT = 3;
const FILE_API_BASE_URL = '/image-api';
const DEFAULT_FETCH_URL = `${FILE_API_BASE_URL}/?ordering=-datetime_uploaded&limit=${PAGE_LIMIT}`;

export const fetchImages = async (fetchUrl = DEFAULT_FETCH_URL): Promise<GetImagesResponse> => {
    const httpClinet = new HTTPClient();

    const authHeaderValue = `Uploadcare.Simple ${UPLOADCARE_PUBLIC_KEY}:${UPLOADCARE_SECRET_KEY}`;

    const headers = { ...httpClinet.baseHeaders, 'Authorization': authHeaderValue };

    const response = await httpClinet.makeRequest<UploadcareGetFilesResponse>(
        'GET',
        fetchUrl,
        {
            headers
        }
    );

    const { results, previous, next } = response;

    const data: ImageMetadata[] = results.map(({ uuid, datetime_uploaded, original_file_url }) => ({
        id: '',
        imageId: uuid,
        imageUploadDate: datetime_uploaded,
        imageContentUrl: original_file_url
    }));

    return {
        previous,
        next,
        data
    };
};

export const postImage = async (imageFile: File): Promise<ImageMetadata> => {
    const formData = new FormData();

    formData.append('file', imageFile);

    const httpClinet = new HTTPClient();

    const authHeaderValue = `Uploadcare.Simple ${UPLOADCARE_PUBLIC_KEY}:${UPLOADCARE_SECRET_KEY}`;

    const contentTypeHeaderValue = 'multipart/form-data';

    const headers = { ...httpClinet.baseHeaders, 'Authorization': authHeaderValue, 'Content-Type': contentTypeHeaderValue };

    const response = await httpClinet.makeRequest<UploadcareFileMetadata>(
        'PUT',
        FILE_API_BASE_URL,
        {
            headers
        }
    );

    const { uuid, datetime_uploaded, original_file_url } = response;

    return {
        id: '',
        imageId: uuid,
        imageUploadDate: datetime_uploaded,
        imageContentUrl: original_file_url
    }
};