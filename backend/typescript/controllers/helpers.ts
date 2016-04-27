import {Response} from 'express';
import {IResponse, ErrorResponse} from '../../../commons/RamAPI';

export function sendDocument<T>(res: Response) {
    return (doc: T): T => {
        if (doc) {
            const response: IResponse<T> = {
                data: doc,
                status: 200
            };
            res.json(response);
        }
        return doc;
    };
}

export function sendError<T>(res: Response, errCode: number = 500) {
    return (errMsg: string): string => {
        if (errMsg) {
            res.json(new ErrorResponse(errCode, errMsg));
        }
        return errMsg;
    };
}

export function sendNotFoundError<T>(res: Response) {
    return (doc: T): T => {
        if (!doc) {
            res.json(new ErrorResponse(404, 'Can\'t find the requested resource.'));
        }
        return doc;
    };
}