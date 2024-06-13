import { ImageMetadata } from '../../models';

export interface IImageCRUDService {
    create(imageBuffer: Buffer): Promise<ImageMetadata>;

    getBatch(
        pageRequest: {
            limit: number
            offset?: number
        }
    ): Promise<ImageMetadata[]>;
}
