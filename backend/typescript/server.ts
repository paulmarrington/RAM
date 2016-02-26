/// <reference path="_BackendTypes.ts" />

import * as express from "express";
import * as path from "path";
import * as loggerMorgan from "morgan";
import * as cookieParser from "cookie-parser";
import * as bodyParser from "body-parser";
import * as methodOverride from "method-override";
import * as cApi from "../../commons/RamAPI";
import * as api from "./ram/ServerAPI";
import * as mongo from "./ram/MongoPersistence";
import {HomeCtrl} from "./controllers/Home.server.ctrl";
import {UsersCtrl} from "./controllers/Users.server.ctrl";
import {RelationsCtrl} from "./controllers/Relations.server.ctrl";
import * as winston from "winston";

if (process.env.RAM_CONF == void 0 || process.env.RAM_CONF.trim().length == 0) {
    console.log("Missing RAM_CONF environment variable, server can't continue.");
    process.exit(1);
}

const conf: api.IRamConf = require(`${process.env.RAM_CONF}`);
const port = conf.httpPort || 3000

const logger = new (winston.Logger)({
    level: "debug",
    transports: [
        new (winston.transports.Console)({
            handleExceptions: true,
            humanReadableUnhandledException: true
        }),
        new (winston.transports.File)({
            filename: `${conf.logDir}/ram.log`,
            level: "debug",
            handleExceptions: true,
            humanReadableUnhandledException: true
        })
    ]
});

var server = express();

mongo.register(conf, logger);

switch (conf.devMode) {
    case false:
        server.use(loggerMorgan("dev")); // todo: Log to file: https://github.com/expressjs/morgan
        break;
    default:
        server.use(loggerMorgan("dev"));
        break;
}

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(cookieParser());
server.use(methodOverride());

server.use(express.static(path.join(__dirname, conf.frontendDir)));

server.use("/api/home", HomeCtrl());
server.use("/api/users", UsersCtrl());

server.use("/api/relations", RelationsCtrl(logger));

// catch 404 and forward to error handler
server.use((req: express.Request, res: express.Response) => {
    var err = new cApi.ErrorResponse(404, "Not Found");
    res.send(err);
});

server.use((ramResponse: cApi.IResponse, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (ramResponse.isError) {
        res.send(ramResponse); // Todo: More specific error handling
    } else {
        res.send(ramResponse);
    }
});

server.listen(conf.httpPort);
console.log(`RAM Server running on port ${conf.httpPort}`);