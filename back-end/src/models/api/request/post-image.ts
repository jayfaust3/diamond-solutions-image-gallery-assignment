import { Request } from 'express';
import { PostImageResponse } from '../response';

export interface PostImageRequest extends Request<{}, PostImageResponse, {}> {
    file?: Express.Multer.File;
}