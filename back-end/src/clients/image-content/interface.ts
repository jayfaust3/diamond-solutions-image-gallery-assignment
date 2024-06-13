import { ImageUploadResult } from '../../models';

export interface ImageClient {
    upload(file: File): Promise<ImageUploadResult>;
}
