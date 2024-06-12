import { ImageMetadata } from '../data';
import { PaginatedAPIResponse } from './api';

export interface GetImagesResponse extends PaginatedAPIResponse<ImageMetadata> {}