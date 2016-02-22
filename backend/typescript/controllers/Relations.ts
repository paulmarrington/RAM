/// <reference path="../_BackendTypes" />

import * as express from "express";
import {DataResponse, IndividualBusinessAuthorisation} from "../../../commons/RamAPI";
import {Persistence, IRamConf} from "../ram/ServerAPI";
import * as enums from "../../../commons/RamEnums";


export function RelationsCtrl(persistence: Persistence) {
    const router: express.Router = express.Router();

    router.get('/123', function(req: express.Request, res: express.Response, next: express.NextFunction) {
        res.send(new DataResponse([
            new IndividualBusinessAuthorisation(
                "Ted's Group",
                "123 2222 2222 22",
                new Date(),
                enums.AuthorisationStatus.Active,
                enums.AccessLevels.Associate
            ),
            new IndividualBusinessAuthorisation(
                "Ali's Group",
                "33 3333 3333 34",
                new Date(),
                enums.AuthorisationStatus.Active,
                enums.AccessLevels.Associate
            )
        ]));
    });
        return router;
}
