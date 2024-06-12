import { Collection } from 'mongodb';
import { ImageMetadataClient } from './interface';
import { ImageMetadata, ImageMetadataDbModel, ImageMetadataInsertRequest } from '../../models';

export class MongoDb implements ImageMetadataClient {
    private readonly _imageCollectionClient: Collection<ImageMetadataDbModel>;

    constructor(imageCollectionClient: Collection<ImageMetadataInsertRequest>) {
        this._imageCollectionClient = imageCollectionClient;
    }

    async create (imageMetadataToCreate: ImageMetadataInsertRequest): Promise<ImageMetadata> {
        const dbModel: ImageMetadataDbModel = MongoDb.mapRequestModelToDbModel(imageMetadataToCreate);

        const result = await this._imageCollectionClient.insertOne(dbModel);

        const id = result.insertedId.toString();;

        return {
            id,
            ...dbModel
        }
    }

    private static mapRequestModelToDbModel(requestModel: ImageMetadataInsertRequest): ImageMetadataDbModel {
        return {
            ...requestModel
        };
    }
}
