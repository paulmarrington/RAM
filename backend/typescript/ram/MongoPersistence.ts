/// <reference path="../_BackendTypes" />

import {Persistence,IRamConf} from "./ServerAPI";
import * as cApi from "../../../commons/RamAPI";

export class MongoPersistence implements Persistence {
    constructor(private conf: IRamConf) {

    }

    getBusinessInformation(businessIds: Array<string>): Array<cApi.BusinessName> {
        console.log("Mongo Persistance storage called!")
        return [];
    }
}