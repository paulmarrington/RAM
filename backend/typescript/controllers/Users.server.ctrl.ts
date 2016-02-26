/// <reference path="../_BackendTypes.ts" />

import * as express from "express";
import {IRamConf} from "../ram/ServerAPI";
import {DataResponse} from "../../../commons/RamAPI";

export function UsersCtrl() {

    var router = express.Router();
    router.get('/', function(req: express.Request, res: express.Response, next: express.NextFunction) {
        res.send(new DataResponse({ list: [1, 2, 3, 4] }));
    });
    return router;
}
