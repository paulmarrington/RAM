import {Response, Request} from 'express';
import {IResponse, ErrorResponse, SearchResult} from '../../../commons/RamAPI';
import * as _ from 'lodash';

export function sendResource<T>(res: Response) {
    'use strict';
    return (doc: T): T => {
        if (doc) {
            res.status(200);
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(doc, null, 4));
        }
        return doc;
    };
}

export function sendList<T>(res: Response) {
    'use strict';
    return async (results: T[]): Promise<T[]> => {
        const resolvedResults = await Promise.all(results);
        if (resolvedResults) {
            res.status(200);
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(resolvedResults, null, 4));
        }
        return results;
    };
}

export function sendSearchResult<T>(res: Response) {
    'use strict';
    return async (results: SearchResult<T>): Promise<SearchResult<T>> => {
        const resolvedResults = await Promise.all(results.result);
        if (resolvedResults) {
            res.status(200);
            res.setHeader('Content-Type', 'application/json');
            res.send(results, null, 4);
        }
        return results;
    };
}

// @deprecated
export function sendDocument<T>(res: Response) {
    'use strict';
    return (doc: T): T => {
        if (doc) {
            const response: IResponse<T> = {
                data: doc
            };
            res.status(200);
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
        console.log(error);
        switch (error.constructor.name) {
            case 'Array':
                res.status(400);
                res.json(new ErrorResponse(error as string[]));
                break;
            case 'String':
                res.status(500);
                res.json(new ErrorResponse(error as string));
                break;
            case 'MongooseError':
                res.status(400);
                res.json(new ErrorResponse(
                    _.values<string>(_.mapValues((error as ValidationError).errors, (v) => v.message))
                ));
                break;
            case 'Error':
                res.status(500);
                res.json(new ErrorResponse((error as Error).message));
                break;
            default:
                res.status(500);
                res.json(new ErrorResponse(error.toString()));
                break;
        }
    };
}

export function sendNotFoundError<T>(res: Response) {
    'use strict';
    return (doc: T): T => {
        if (!doc) {
            res.status(404);
            res.json(new ErrorResponse('Can\'t find the requested resource.'));
        }
        return doc;
    };
}