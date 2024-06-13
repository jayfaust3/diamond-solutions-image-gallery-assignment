import {
    FileInfo,
    storeFile,
    UploadcareSimpleAuthSchema,
} from '@uploadcare/rest-client';
import { base, BaseResponse } from '@uploadcare/upload-client'
import { ImageClient } from './interface';
import { ImageUploadResult } from '../../models';
  
export class UploadCare implements ImageClient{
    private readonly _authSchema: UploadcareSimpleAuthSchema;

    constructor(authSchema: UploadcareSimpleAuthSchema) {
        this._authSchema = authSchema;
    }

    async upload(imageBuffer: Buffer): Promise<ImageUploadResult> {
        const uploadResult: BaseResponse = await base(
            imageBuffer,
            {
              publicKey: this._authSchema.publicKey,
              store: true
            }
        );

        const { file: imageId } = uploadResult;

        const storageResult: FileInfo = await storeFile(
            {
              uuid: imageId,
            },
            { 
                authSchema: this._authSchema 
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
}
