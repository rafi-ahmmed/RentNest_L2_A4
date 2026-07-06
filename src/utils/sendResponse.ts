import { Response } from 'express';

type TMeta = {
   page: number;
   limit: number;
   total: number;
};

type TResponse<T> = {
   success: boolean;
   statusCode: number;
   message: string;
   data: T;
   meta?: TMeta;
};

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
   return res.status(data.statusCode).json({
      success: data.success,
      message: data.message,
      data: data.data,
      meta: data.meta,
   });
};

export default sendResponse;
