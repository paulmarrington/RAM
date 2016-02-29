/// <reference path="../_BackendTypes.ts" />

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