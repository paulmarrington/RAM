/// <reference path="../_BackendTypes.ts" />

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