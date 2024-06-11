import { ImageMetadata } from '../data';
import { APIResponse } from './api-response';

export interface GetImageResponse extends APIResponse<ImageMetadata> {}