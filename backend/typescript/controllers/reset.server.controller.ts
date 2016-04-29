/// <reference path='../_BackendTypes.ts' />

/*
 * Reset controller only works in debug mode (see conf.js).
 * It downloads and unpacks the 'latest' code and restarts
 * the server. By default it will take the code from the
 * atogov/develop branch. Tbe URL can have a tag option
 * that in truth can be a tag, branch or git hash for a
 * check-in.
 */

import {Router, Request, Response} from 'express';
import * as url from 'url';
import * as path from 'path';
import {exec} from 'child_process';
import {sendError} from './helpers';

interface Query { tag?: string; }

export class ResetController {

  private reset = (req: Request, res: Response) => {
    const query: Query = url.parse(req.url, true).query;
    if (!query.tag) {
      sendError(res);
    } else {
      const cmd = path.join('..', 'update.sh ' + query.tag);
      exec(cmd, (err, stdout, stderr) => {
        // don't need a non-error response as server restarts
        sendError(res);
      });
    }
  };
  public assignRoutes = (router: Router) => {
    router.get('/', this.reset);
    return router;
  }
}