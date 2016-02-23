/// <reference path="../_BackendTypes" />

"use strict";

import {Persistence, IRamConf} from "./ServerAPI";
import {DataResponse, IndividualBusinessAuthorisation, BusinessName} from "../../../commons/RamAPI";
import * as enums from "../../../commons/RamEnums";

export class MongoPersistence implements Persistence {
    constructor(private conf: IRamConf) {

    }

    getBusinessInformation(businessIds: Array<string>): Promise<DataResponse<Array<BusinessName>>> {
        return new Promise((resolve, reject) => {
            resolve(new DataResponse([
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
    }
}