/// <reference path="../_BackendTypes.ts" />

/*
 * Reset controller only works in debug mode (see conf.js).
 * It downloads and unpacks the 'latest' code and restarts
 * the server. By default it will take the code from the
 * atogov/develop branch. Tbe URL can have a tag option
 * that in truth can be a tag, branch or git hash for a
 * check-in.
 */

import * as express from "express";
import * as url from "url";
import * as path from "path"
import {exec} from "child_process";
import {IRamConf} from "../ram/ServerAPI";
import {DataResponse} from "../../../commons/RamAPI";
import * as cApi from "../../../commons/RamAPI";
import * as enums from "../../../commons/RamEnums";
import {LoggerInstance} from "winston";

interface Query { tag?: string; }

export function ResetCtrl(logger:LoggerInstance) {
    const router: express.Router = express.Router();

    router.get('/', function(req: express.Request,
    res: express.Response, next: express.NextFunction) {
      
      const query: Query = url.parse(req.url, true).query;
      if (!query.tag) {
        res.send(new DataResponse({
          error: "usage: #url#/api/reset?tag=develop"
        }));
      } else {
        const cmd = path.join("..", "update.sh " + query.tag);
        exec(cmd, function(err, stdout, stderr){
          res.send(new DataResponse({
            message: "reset to " + query.tag,
            error: err ? err.message : false,
            stdout: stdout,
            stderr: stderr
          }));
        });
      }
      
    });
    return router;
}
