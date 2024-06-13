import { ImageMetadata, ImageMetadataInsertRequest } from '../../models';

export interface ImageMetadataClient {
    getSingle(imageMetadataId: string): Promise<ImageMetadata | null>;
    get (limit: number, offset?: number): Promise<ImageMetadata[]>;
    create (imageMetadataToCreate: ImageMetadataInsertRequest): Promise<ImageMetadata>;
    delete(id: string): Promise<void>;
}