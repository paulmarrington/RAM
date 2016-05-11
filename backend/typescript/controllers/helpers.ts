import {Response} from 'express';
import {IResponse, ErrorResponse} from '../../../commons/RamAPI';
import * as _ from 'lodash';

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

type ValidationError = {
    errors: { [index: string]: ValidationError };
    message: string;
}

export function sendError<T>(res: Response) {
    return (error: string | Error | ValidationError | string[]) => {
        switch (error.constructor.name) {
            case 'Array':
                res.json(new ErrorResponse(400, error as string[]));
                break;
            case 'String':
                res.json(new ErrorResponse(500, error as string));
                break;
            case 'MongooseError':
                res.json(new ErrorResponse(400,
                    _.values<string>(_.mapValues((error as ValidationError).errors, (v) => v.message))
                ));
                break;
            case 'Error':
                res.json(new ErrorResponse(500, (error as Error).message));
                break;
            default:
                res.json(new ErrorResponse(500, error.toString()));
                break;
        }
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