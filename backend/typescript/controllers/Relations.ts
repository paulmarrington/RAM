/// <reference path="../_BackendTypes.ts" />

import * as express from "express";
import {DataResponse, IndividualBusinessAuthorisation} from "../../../commons/RamAPI";
import {Persistence, IRamConf} from "../ram/ServerAPI";
import * as enums from "../../../commons/RamEnums";
import {Promise,Deferred,IPromise} from "q";

export function RelationsCtrl(persistence: Persistence) {
    const router: express.Router = express.Router();

    router.get('/123', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        var businessInfo = await persistence.getBusinessInformation(["123"])
        res.send(businessInfo);
        return businessInfo;
    });
        return router;
}
