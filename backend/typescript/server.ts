/// <reference path="_BackendTypes" />

import * as express from "express";
import * as path from "path";
import * as logger from "morgan";
import * as cookieParser from "cookie-parser";
import * as bodyParser from "body-parser";
import * as methodOverride from "method-override";
import * as cApi from "../../commons/RamAPI";
import * as api from "./ram/ServerAPI";
import * as mongo from "./ram/MongoPersistence";

import {HomeCtrl} from "./controllers/Home";
import {UsersCtrl} from "./controllers/Users";
import {RelationsCtrl} from "./controllers/Relations";

const conf:api.IRamConf = require(`${process.env.RAM_CONF}`);
const port = conf.httpPort || 3000

var server = express();
var persistance = new mongo.MongoPersistence(conf);

switch (conf.devMode) {
    case false:
        server.use(logger("dev")); // todo: Log to file: https://github.com/expressjs/morgan
        break;
    default:
        server.use(logger("dev"));
        break;
}

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(cookieParser());
server.use(methodOverride());

server.use(express.static(path.join(__dirname, conf.frontendDir)));

server.use("/api/home", HomeCtrl(persistance));
server.use("/api/users", UsersCtrl(persistance));
server.use("/api/relations", RelationsCtrl(persistance));

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