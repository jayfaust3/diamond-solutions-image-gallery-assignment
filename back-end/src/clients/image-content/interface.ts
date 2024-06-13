import { ImageUploadResult } from '../../models';

export interface ImageClient {
    upload(imageBuffer: Buffer): Promise<ImageUploadResult>;
}
