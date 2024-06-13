import { Request, RequestHandler, Response } from 'express';
import { getImageCRUDService } from '../../utils';
import { IImageCRUDService } from '../../services';

const deleteImage: RequestHandler = async (req: Request, res: Response) => {
    const imageMetadataId = req.params.id;

    const service: IImageCRUDService = await getImageCRUDService();

    await service.delete(imageMetadataId);

    res.status(204).send({});
};

export default deleteImage;