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
import {IRamConf} from "../ram/ServerAPI";
import {DataResponse} from "../../../commons/RamAPI";
import * as cApi from "../../../commons/RamAPI";
import * as enums from "../../../commons/RamEnums";
import {LoggerInstance} from "winston";

export function HomeCtrl(logger:LoggerInstance) {

    const router: express.Router = express.Router();

    router.get('/', function(req: express.Request, res: express.Response, next: express.NextFunction) {
        res.send(new DataResponse({page:"home"}));
    });
    return router;

}
