/// <reference path="../_BackendTypes" />

import * as express from "express";
import * as cApi from "../../../commons/RamAPI";
import {Persistence,IRamConf} from "../ram/ServerAPI";

export function RelationsCtrl(persistence: Persistence) {
    var router: express.Router = express.Router();

    router.get('/', function(req: express.Request, res: express.Response, next: express.NextFunction) {
        res.send(new cApi.DataResponse([
            new cApi.BusinessName("Bob's Business", "123 456 7890"),
            new cApi.BusinessName("Joe's Business", "222 222 2222")
        ]));
    });

    return router;
}