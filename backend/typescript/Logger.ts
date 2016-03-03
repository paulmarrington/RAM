/// <reference path="_BackendTypes.ts" />

import * as winston from "winston";
import * as morgan from "morgan";
import * as api from "./ram/ServerAPI";

const conf: api.IRamConf = require(`${process.env.RAM_CONF}`);

export const logger = new (winston.Logger)({
    level: "debug",
    exitOnError: false,
    transports: [
        new (winston.transports.Console)({
            handleExceptions: true,
            humanReadableUnhandledException: true,
            colorize: true
        }),
        new (winston.transports.File)({
            level: "debug",
            filename: `${conf.logDir}/ram.log`,
            handleExceptions: true,
            humanReadableUnhandledException: true,
            json: true,
            maxsize: (1024 * 1024), //1MB
            maxFiles: 5,
            colorize: false
        })
    ]
});

export const logStream: morgan.StreamOptions = {
    write (message: string) {
        logger.info(message);
    }
};
