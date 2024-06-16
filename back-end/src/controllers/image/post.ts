import { RequestHandler, Response } from 'express';
import { ImageMetadata, PostImageRequest, PostImageResponse } from '../../models';
import { getImageCRUDService } from '../../utils';
import { IImageCRUDService } from '../../services';

const post: RequestHandler = async (req: PostImageRequest, res: Response) => {    
    const imageFile = req.file;

    if (!imageFile) {
        res.status(400).send({ message: 'The request did not contain a file' });

        return;
    }

    const imageBuffer = imageFile.buffer;

    const service: IImageCRUDService = getImageCRUDService();

    const createResult: ImageMetadata = await service.create(imageBuffer);

    const response: PostImageResponse = {
        data: createResult
    } 

    res.status(201).send(response);
};

export default post;