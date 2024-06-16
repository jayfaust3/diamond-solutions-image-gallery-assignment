import { ImageClient, ImageMetadataClient, MongoDb, UploadCare } from '../clients';
import { IImageCRUDService, ImageCRUDService } from '../services';

const getImageClient = (): ImageClient => {    
    return new UploadCare();
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
