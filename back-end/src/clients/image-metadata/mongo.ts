import { Collection, ObjectId, WithId } from 'mongodb';
import { ImageMetadataClient } from './interface';
import { ImageMetadata, ImageMetadataDbModel, ImageMetadataInsertRequest } from '../../models';

export class MongoDb implements ImageMetadataClient {
    private readonly _imageCollectionClient: Collection<ImageMetadataDbModel>;

    constructor(imageCollectionClient: Collection<ImageMetadataInsertRequest>) {
        this._imageCollectionClient = imageCollectionClient;
    }

    async get (limit: number, offset?: number): Promise<ImageMetadata[]> {
        const cursor = this._imageCollectionClient
            .find()
            .limit(limit);

        if (offset) cursor.skip(offset);

        const results = await cursor.toArray();

        return results.map(MongoDb.mapFindResultModelToAppModel);
    }

    async create (imageMetadataToCreate: ImageMetadataInsertRequest): Promise<ImageMetadata> {
        const dbModel: ImageMetadataDbModel = MongoDb.mapInsertRequestModelToDbModel(imageMetadataToCreate);

        const result = await this._imageCollectionClient.insertOne(dbModel);

        const id = result.insertedId.toString();;

        return {
            id,
            ...dbModel
        }
    }

    async delete(id: string): Promise<void> {
        const objectId = new ObjectId(id);

        await this._imageCollectionClient.deleteOne({ _id: objectId });
    }

    private static mapInsertRequestModelToDbModel(requestModel: ImageMetadataInsertRequest): ImageMetadataDbModel {
        return {
            ...requestModel
        };
    }

    private static mapFindResultModelToAppModel(resultModel: WithId<ImageMetadataDbModel>): ImageMetadata {
        const { _id, imageId, imageContentUrl, imageUploadDate } = resultModel;
        
        return {
            id: _id.toString(),
            imageId,
            imageContentUrl,
            imageUploadDate
        };
    }
}
