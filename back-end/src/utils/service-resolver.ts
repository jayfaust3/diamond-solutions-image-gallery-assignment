import { UploadcareSimpleAuthSchema } from '@uploadcare/rest-client';
import { Collection } from 'mongodb';
import { ImageClient, ImageMetadataClient, MongoDb, UploadCare } from '../clients';
import { IImageCRUDService, ImageCRUDService } from '../services';
import { getUploadcareSimpleAuthSchema } from './upload-care';
import { getMongoDbCollectionClient } from './mongo';
import { ImageMetadataDbModel } from '../models';

const getImageClient = (): ImageClient => {
    const authSchema: UploadcareSimpleAuthSchema = getUploadcareSimpleAuthSchema();
    
    return new UploadCare(authSchema);
};

const getImageMetadataClient = async (): Promise<ImageMetadataClient> => {
    const {
        MONGODB_COLLECTION_NAME: imageMetadataCollectionName
    } = process.env;

    if (!imageMetadataCollectionName) throw new Error('Missing MongoDb configuration');

    const imageMetadataCollectionClient: Collection<ImageMetadataDbModel> =
        await getMongoDbCollectionClient<ImageMetadataDbModel>(imageMetadataCollectionName);

    return new MongoDb(imageMetadataCollectionClient);
}

export const getImageCRUDService = async (): Promise<IImageCRUDService> => {
    const imageClient: ImageClient = getImageClient();

    const imageMetadataClient = await getImageMetadataClient();

    return new ImageCRUDService(
        imageClient,
        imageMetadataClient
    );
};
