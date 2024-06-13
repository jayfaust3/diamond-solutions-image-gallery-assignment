import { ImageMetadata } from '../data';
import { APIResponse } from './api';

export interface PostImageResponse extends APIResponse<ImageMetadata> {}