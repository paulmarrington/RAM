import * as express from "express";
import * as path from "path";
import * as loggerMorgan from "morgan";
import * as bodyParser from "body-parser";
import * as methodOverride from "method-override";
import * as cApi from "../../commons/RamAPI";
import * as api from "./ram/ServerAPI";
import {ResetCtrl} from "./controllers/Reset.server.ctrl";
import {logger, logStream} from "./Logger";
// import {continueOnlyIfJWTisValid} from "./security"
// Prepare mongoose for daily operations
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/ram");

import {PartyAPI} from "./controllers/Party"
import {RelationshipAPI} from "./controllers/Relationship"

if (process.env.RAM_CONF === void 0 || process.env.RAM_CONF.trim().length === 0) {
    console.log("Missing RAM_CONF environment variable, server can't continue.");
    process.exit(1);
}

const conf: api.IRamConf = require(`${process.env.RAM_CONF}`);
const port = conf.httpPort || 3000;

 const server = express();

switch (conf.devMode) {
    case false:
        server.use(loggerMorgan("prod", { stream: logStream })); // todo: Log to file: https://github.com/expressjs/morgan
        break;
    default:
        server.use(loggerMorgan("dev", { stream: logStream }));
        break;
}

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(methodOverride());

// server.use(continueOnlyIfJWTisValid(conf.jwtSecretKey,true));

server.use(express.static(path.join(__dirname, conf.frontendDir)));

server.use("/api/reset", ResetCtrl());
server.use("/api/1/party", PartyAPI())
server.use("/api/1/relationship", RelationshipAPI())

// catch 404 and forward to error handler
server.use((req: express.Request, res: express.Response) => {
    const err = new cApi.ErrorResponse(404, "Not Found");
    res.send(err);
});

// server.use((ramResponse: cApi.IResponse, req: express.Request, res: express.Response, next: express.NextFunction) => {
//     if (ramResponse.isError) {
//         res.send(ramResponse); // Todo: More specific error handling
//     } else {
//         res.send(ramResponse);
//     }
// });

server.listen(conf.httpPort);
console.log(`RAM Server running on port ${conf.httpPort}`);