import { UploadcareSimpleAuthSchema } from '@uploadcare/rest-client';
import { ImageClient, ImageMetadataClient, MongoDb, UploadCare } from '../clients';
import { IImageCRUDService, ImageCRUDService } from '../services';
import { getUploadcareSimpleAuthSchema } from './upload-care';

const getImageClient = (): ImageClient => {
    const authSchema: UploadcareSimpleAuthSchema = getUploadcareSimpleAuthSchema();
    
    return new UploadCare(authSchema);
};

const getImageMetadataClient = (): ImageMetadataClient => {
    return new MongoDb();
}

export const getImageCRUDService = (): IImageCRUDService => {
    const imageClient: ImageClient = getImageClient();

    const imageMetadataClient = getImageMetadataClient();

    return new ImageCRUDService(
        imageClient,
        imageMetadataClient
    );
};
