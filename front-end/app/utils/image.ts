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
const DEFAULT_FETCH_URL = `https://api.uploadcare.com/files/?ordering=-datetime_uploaded&limit=${PAGE_LIMIT}`;

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

