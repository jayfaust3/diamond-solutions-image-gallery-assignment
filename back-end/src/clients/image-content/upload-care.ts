import {
    deleteFile,
    FileInfo,
    storeFile,
    UploadcareSimpleAuthSchema,
} from '@uploadcare/rest-client';
import { base, BaseResponse } from '@uploadcare/upload-client'
import { ImageClient } from './interface';
import { ImageUploadResult } from '../../models';
import { getUploadcareSimpleAuthSchema } from '../../utils';
  
export class UploadCare implements ImageClient{

    constructor() {}

    async upload(imageBuffer: Buffer): Promise<ImageUploadResult> {
        const authSchema: UploadcareSimpleAuthSchema = getUploadcareSimpleAuthSchema();
        
        const uploadResult: BaseResponse = await base(
            imageBuffer,
            {
              publicKey: authSchema.publicKey,
              store: true
            }
        );

        const { file: imageId } = uploadResult;

        const storageResult: FileInfo = await storeFile(
            {
              uuid: imageId,
            },
            { 
                authSchema: authSchema 
            }
        );

        const { datetimeUploaded: imageUploadDate, originalFileUrl: imageContentUrl} = storageResult;

        if (!imageContentUrl) throw new Error('Public url not set');

        return {
            imageId,
            imageContentUrl,
            imageUploadDate
        }
    }

    async delete(imageId: string): Promise<void> {
        const authSchema: UploadcareSimpleAuthSchema = getUploadcareSimpleAuthSchema();

        await deleteFile(
            { 
                uuid: imageId
            },
            {
                authSchema 
            }
        );
    }
}
