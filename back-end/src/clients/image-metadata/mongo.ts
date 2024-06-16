import { Collection, ObjectId, WithId } from 'mongodb';
import { ImageMetadataClient } from './interface';
import { ImageMetadata, ImageMetadataDbModel, ImageMetadataInsertRequest } from '../../models';
import { getMongoDbCollectionClient } from '../../utils';

export class MongoDb implements ImageMetadataClient {
    private _imageCollectionClient: Collection<ImageMetadataDbModel> | null = null;;

    constructor() {}

    async getSingle(imageMetadataId: string): Promise<ImageMetadata | null> {
        const collection =  await this.getImageCollectionClient();

        let imageMetadata: ImageMetadata | null = null;

        const objectId = new ObjectId(imageMetadataId);

        const result = await collection.findOne({ _id: objectId });

        if (result) imageMetadata = MongoDb.mapFindResultModelToAppModel(result);

        return imageMetadata;
    }

    async get (limit: number, offset?: number): Promise<ImageMetadata[]> {
        const collection =  await this.getImageCollectionClient();

        const cursor = collection
            .find()
            .sort('imageUploadDate', 'desc')
            .limit(limit)
            .skip(offset ?? 0);

        const results = await cursor.toArray();

        return results.map(MongoDb.mapFindResultModelToAppModel);
    }

    async create (imageMetadataToCreate: ImageMetadataInsertRequest): Promise<ImageMetadata> {
        const collection =  await this.getImageCollectionClient();

        const dbModel: ImageMetadataDbModel = MongoDb.mapInsertRequestModelToDbModel(imageMetadataToCreate);

        const result = await collection.insertOne(dbModel);

        const id = result.insertedId.toString();;

        return {
            id,
            ...dbModel
        }
    }

    async delete(id: string): Promise<void> {
        const collection =  await this.getImageCollectionClient();

        const objectId = new ObjectId(id);

        await collection.deleteOne({ _id: objectId });
    }

    private async getImageCollectionClient(): Promise<Collection<ImageMetadataDbModel>> {
        if (!this._imageCollectionClient) {
            const {
                MONGODB_COLLECTION_NAME: imageMetadataCollectionName
            } = process.env;
        
            if (!imageMetadataCollectionName) throw new Error('Missing MongoDb configuration');
        
            const imageMetadataCollectionClient: Collection<ImageMetadataDbModel> =
                await getMongoDbCollectionClient<ImageMetadataDbModel>(imageMetadataCollectionName);

            this._imageCollectionClient = imageMetadataCollectionClient; 
        }

        return this._imageCollectionClient;
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
