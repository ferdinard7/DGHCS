import { NextFunction, Request, Response } from "express"
import { ErrorCode, HttpException } from "./exceptions/root"
import { InternalException } from "./exceptions/internal-exception"

export const errorHandler = (method: Function) => {
   return (req: Request, res: Response, next: NextFunction) => {
    try {
       method(req, res, next)
    } catch(error: any) {
        let exception : HttpException
        if(error instanceof HttpException) {
            exception = error;
        } else {
            exception = new InternalException("something went wrong", error, ErrorCode.INTERNAL_EXCEPTION)
        }
        next(exception)
    }
   }
}