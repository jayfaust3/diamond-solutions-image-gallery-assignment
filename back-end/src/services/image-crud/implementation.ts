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

    async create(file: File): Promise<ImageMetadata> {
        const uploadResult: ImageUploadResult = await this._imageClient.upload(file);

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
}
