import { ImageMetadata } from '../../models';

export interface IImageCRUDService {
    create(file: File): Promise<ImageMetadata>;

    getBatch(
        pageRequest: {
            limit: number
            offset?: number
        }
    ): Promise<ImageMetadata[]>;
}
