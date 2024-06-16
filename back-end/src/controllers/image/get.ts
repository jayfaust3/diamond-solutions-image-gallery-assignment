import { Request, RequestHandler, Response } from 'express';
import { GetImagesResponse, ImageMetadata } from '../../models';
import { getImageCRUDService } from '../../utils';
import { IImageCRUDService } from '../../services';

const maxAndDefaultPageLimit = 10;

const get: RequestHandler = async (req: Request<{}, GetImagesResponse, {}>, res: Response) => {
    const { limit, offset } = req.query;

    const pageLimit = limit ? 
        Math.max(Math.min(Number(limit), maxAndDefaultPageLimit), 0) :
        maxAndDefaultPageLimit;

    const pageOffset = offset ? Math.max(Number(offset), 0) : undefined;

    const service: IImageCRUDService = getImageCRUDService();

    const results: ImageMetadata[] = await service.getBatch({
        limit: pageLimit,
        offset: pageOffset
    });

    res.status(200).send({
        data: results
    });
};

export default get;