import { Request, RequestHandler } from 'express';
import { ImageMetadata, PostImageResponse } from '../../models';
import { getImageCRUDService } from '../../utils';
import { IImageCRUDService } from '../../services';

const post: RequestHandler = async (req: Request<{}, PostImageResponse, File>, res) => {
    const file: File = req.body;

    const service: IImageCRUDService = await getImageCRUDService();

    const result: ImageMetadata = await service.create(file);

    res.status(201).send({
        data: result
    });
};

export default post;