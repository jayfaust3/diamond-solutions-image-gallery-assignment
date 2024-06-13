import { NextFunction, Request, RequestHandler, Response } from 'express';

export const errorMiddleware = (handler: RequestHandler) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res, next);
    } catch (err) {
      next(err);
    }
};
