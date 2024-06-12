import { Request, RequestHandler } from 'express';
import { GetImagesResponse } from '../../models';

const get: RequestHandler = async (req: Request<{}, GetImagesResponse, {}>, res) => {
    // const pageToken: string | undefined = req.query.pageToken;

    res.status(200).send({
        data: [],
        previous: null,
        next: null
    });
};

export default get;