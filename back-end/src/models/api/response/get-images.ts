import { ImageMetadata } from '../../data';
import { APIResponse } from './api';

export interface GetImagesResponse extends APIResponse<ImageMetadata[]> {}