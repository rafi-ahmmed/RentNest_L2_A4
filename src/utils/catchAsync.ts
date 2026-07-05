import { NextFunction, Request, RequestHandler, Response } from 'express';

const catchAsync = async (fun: RequestHandler) => {
   return async (req: Request, res: Response, next: NextFunction) => {
      try {
         await fun(req, res, next);
      } catch (error) {}
   };
};

export default catchAsync;
