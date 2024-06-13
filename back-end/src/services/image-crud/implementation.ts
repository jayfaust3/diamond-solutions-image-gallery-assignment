import { IImageCRUDService } from './interface';
import { ImageClient, ImageMetadataClient } from '../../clients';
import { ImageMetadata, ImageMetadataInsertRequest, ImageUploadResult } from '../../models';

export class ImageCRUDService implements IImageCRUDService {
    private readonly _imageClient: ImageClient;
    private readonly _imageMetadataClient: ImageMetadataClient;

    constructor (
        imageClient: ImageClient,
        imageMetadataClient: ImageMetadataClient
    ) {
        this._imageClient = imageClient;
        this._imageMetadataClient = imageMetadataClient;
    }

    async create(imageBuffer: Buffer): Promise<ImageMetadata> {
        const uploadResult: ImageUploadResult = await this._imageClient.upload(imageBuffer);

        const insertRequest: ImageMetadataInsertRequest = {
            ...uploadResult
        };

        return this._imageMetadataClient.create(insertRequest);
    }

    async getBatch(
        pageRequest: {
            limit: number
            offset?: number
        }
    ): Promise<ImageMetadata[]> {
        const { limit, offset } = pageRequest;

        return this._imageMetadataClient.get(limit, offset);
    }

    async delete(imageMetadataId: string): Promise<void> {
        const imageMetadataToDelete = await this._imageMetadataClient.getSingle(imageMetadataId);

        if (imageMetadataToDelete) {
            const { imageId } = imageMetadataToDelete;
            
            await this._imageMetadataClient.delete(imageMetadataId);

            await this._imageClient.delete(imageId);
        }
    }
}
