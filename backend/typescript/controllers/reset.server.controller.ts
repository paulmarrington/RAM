/// <reference path='../_BackendTypes.ts' />

/*
 * Reset controller only works in debug mode (see conf.js).
 * It downloads and unpacks the 'latest' code and restarts
 * the server. By default it will take the code from the
 * atogov/develop branch. Tbe URL can have a tag option
 * that in truth can be a tag, branch or git hash for a
 * check-in.
 */

import * as express from 'express';
import * as url from 'url';
import * as path from 'path';
import {exec} from 'child_process';
import {ErrorResponse} from '../../../commons/RamAPI';

interface Query { tag?: string; }

export const ResetCtrl = () => {
    const router: express.Router = express.Router();

    router.get('/', (req: express.Request,
    res: express.Response, next: express.NextFunction) => {

      const query: Query = url.parse(req.url, true).query;
      if (!query.tag) {
        res.send(new ErrorResponse(400, 'usage: #url#/api/reset?tag=develop'));
      } else {
        const cmd = path.join('..', 'update.sh ' + query.tag);
        exec(cmd, (err, stdout, stderr) => {
            res.send(new ErrorResponse(404, 'tag/branch/hash not found for ' + query.tag));
        });
      }

    });
    return router;
};
