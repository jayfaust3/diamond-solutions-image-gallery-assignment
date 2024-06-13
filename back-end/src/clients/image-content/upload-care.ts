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

    async upload(file: File): Promise<ImageUploadResult> {
        const fileData = await file.arrayBuffer();

        const fileBuffer = Buffer.from(fileData);

        const uploadResult: BaseResponse = await base(
            fileBuffer,
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

        const {  datetimeUploaded: imageUploadDate, url: imageContentUrl} = storageResult;

        return {
            imageId,
            imageContentUrl,
            imageUploadDate
        }
    }
}
