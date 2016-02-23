/// <reference path="../_BackendTypes" />

/**
* IRamConf is used for providing type safety over configuration
* file provided through environment variable
*/

import * as cApi from "../../../commons/RamAPI";

export interface IRamConf {
    frontendDir: string
    logDir: string
    httpPort: number
    mongoURL: string
    devMode: boolean
}

export interface Persistence {
    getBusinessInformation(businessIds: Array<string>):Promise<cApi.DataResponse<Array<cApi.BusinessName>>>
}