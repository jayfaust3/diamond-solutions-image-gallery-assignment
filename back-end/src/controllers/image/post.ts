import { RequestHandler, Response } from 'express';
import { ImageMetadata, PostImageRequest, PostImageResponse } from '../../models';
import { getImageCRUDService } from '../../utils';
import { IImageCRUDService } from '../../services';

const post: RequestHandler = async (req: PostImageRequest, res: Response) => {    
    const imageFile = req.file;

    if (!imageFile) {
        console.log('No file uploaded.', { req });
        res.status(400).send({ message: 'No file uploaded.' });

        return;
    }

    const imageBuffer = imageFile.buffer;

    const service: IImageCRUDService = await getImageCRUDService();

    const result: ImageMetadata = await service.create(imageBuffer);

    res.status(201).send({
        data: result
    });
};

export default post;