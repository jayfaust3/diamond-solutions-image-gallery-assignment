export interface ImageMetadata {
    id: string
    imageId: string
    imageUploadDate: string
    imageContentUrl: string
}

export type ImageMetadataInsertRequest = Pick<ImageMetadata, 'imageId' | 'imageUploadDate' | 'imageContentUrl'>
