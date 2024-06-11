import { ImageMetadata } from '../models';
import { HTTPClient } from './http';

interface UploadcareFileMetadata {
    uuid: string
    datetime_uploaded: string
    original_file_url: string
  }
  
interface UploadcareGetFilesResponse {
    next?: string | null
    results: UploadcareFileMetadata[]
}

const UPLOADCARE_PUBLIC_KEY = '';
const UPLOADCARE_SECRET_KEY = '';

export const fetchImages = async (pageLimit: number, pageNumber = 1): Promise<ImageMetadata[]> => {
    const offset = (pageNumber - 1) * pageLimit;
    const fetchUrl = `https://api.uploadcare.com/files/?limit=${pageLimit}&offset=-${offset}`;

    const httpClinet = new HTTPClient();

    const authHeaderValue = `Uploadcare.Simple ${UPLOADCARE_PUBLIC_KEY}:${UPLOADCARE_SECRET_KEY}`;

    const headers = { ...httpClinet.baseHeaders, 'Authorization': authHeaderValue };

    const response = await httpClinet.makeRequest<UploadcareGetFilesResponse>('GET', fetchUrl, {
        headers
    });

    const { results } = response;

    return results.map(({ uuid, datetime_uploaded, original_file_url }) => ({
        imageId: uuid,
        imageUploadDate: datetime_uploaded,
        imageContentUrl: original_file_url
    }));
};

