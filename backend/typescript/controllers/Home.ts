/// <reference path="../_BackendTypes" />

import * as express from "express";
import {Persistence,IRamConf} from "../ram/ServerAPI";
import {DataResponse} from "../../../commons/RamAPI";
import * as cApi from "../../../commons/RamAPI";
import * as enums from "../../../commons/RamEnums";

export function HomeCtrl(persistence: Persistence) {

    const router: express.Router = express.Router();

    router.get('/', function(req: express.Request, res: express.Response, next: express.NextFunction) {
        res.send(new DataResponse({page:"home"}));
    });
    return router;

}