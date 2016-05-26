import {Response, Request} from 'express';
import {IResponse, ErrorResponse} from '../../../commons/RamAPI';
import * as _ from 'lodash';

export function sendDocument<T>(res: Response) {
    'use strict';
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

export function validateReqSchema<T>(req: Request, schema: Object): Promise<Request> {
    'use strict';
    return new Promise<Request>((resolve, reject) => {
        req.checkParams(schema);
        const errors = req.validationErrors(false) as { msg: string }[];
        if (errors) {
            const errorMsgs = errors.map((e) => e.msg);
            reject(errorMsgs);
        } else {
            resolve(req);
        }
    });
}

type ValidationError = {
    errors: { [index: string]: ValidationError };
    message: string;
}

export function sendError<T>(res: Response) {
    'use strict';
    return (error: string | Error | ValidationError | string[]) => {
        switch (error.constructor.name) {
            case 'Array':
                res.status(400);
                res.json(new ErrorResponse(400, error as string[]));
                break;
            case 'String':
                res.status(500);
                res.json(new ErrorResponse(500, error as string));
                break;
            case 'MongooseError':
                res.status(400);
                res.json(new ErrorResponse(400,
                    _.values<string>(_.mapValues((error as ValidationError).errors, (v) => v.message))
                ));
                break;
            case 'Error':
                res.status(500);
                res.json(new ErrorResponse(500, (error as Error).message));
                break;
            default:
                res.status(500);
                res.json(new ErrorResponse(500, error.toString()));
                break;
        }
    };
}

export function sendNotFoundError<T>(res: Response) {
    'use strict';
    return (doc: T): T => {
        res.status(404);
        if (!doc) {
            res.json(new ErrorResponse(404, 'Can\'t find the requested resource.'));
        }
        return doc;
    };
}