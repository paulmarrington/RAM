/// <reference path="../_BackendTypes.ts" />

"use strict";

import * as express from "express";
import {DataResponse, IndividualBusinessAuthorisation, BusinessName} from "../../../commons/RamAPI";
import {IRamConf} from "../ram/ServerAPI";
import * as enums from "../../../commons/RamEnums";
import * as mongoose from "mongoose";
import {IndividualBusinessAuthorisationDAO} from "../models/BusinessAuthorisation.server.model";
import {logger} from "../Logger";

export function RelationsCtrl() {
    const router: express.Router = express.Router();

    router.get("/123", async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const businesses = new IndividualBusinessAuthorisationDAO(logger);
        const businessInfo = await businesses.getBusinessInformation(["123"]);
        res.send(new DataResponse(businessInfo));
    });
    return router;
}
