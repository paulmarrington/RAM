/// <reference path="../_BackendTypes.ts" />

import * as express from "express";
import * as cApi from "../../../commons/RamAPI";
import {IRamConf} from "../ram/ServerAPI";
import * as mongoose from "mongoose";
// import {IndividualBusinessAuthorisationDAO} from "../models/BusinessAuthorisation.server.model";
import {logger} from "../Logger";

export function RelationsCtrl() {
    const router: express.Router = express.Router();

    router.get("/123", async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        // const businesses = new IndividualBusinessAuthorisationDAO();
        // const businessInfo = await businesses.getBusinessInformation(["123"]);
        res.send(new cApi.DataResponse([]));
    });
    return router;
}
