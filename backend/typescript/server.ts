/// <reference path="all_types" />

import * as express from "express";
import * as path from "path";
import * as logger from "morgan";
import * as cookieParser from "cookie-parser";
import * as bodyParser from "body-parser";
import * as methodOverride from "method-override";
import * as ram from "./ram/API";

const conf:ram.IRamConf = require(`${process.env.RAM_CONF}`);
const port = conf.httpPort || 3000


var server = express();

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

import homeRte from "./routes/home";
import usersRte from "./routes/users";

server.use("/api/home", homeRte);
server.use("/api/users", usersRte);

// catch 404 and forward to error handler
server.use((req: express.Request, res: express.Response) => {
    var err = new ram.ErrorResponse(404, "Not Found");
    res.send(err);
});

server.use((ramResponse: ram.IResponse, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (ramResponse.isError) {
        res.send(ramResponse); // Todo: More specific error handling
    } else {
        res.send(ramResponse);
    }
});

server.listen(conf.httpPort);
console.log(`RAM Server running on port ${conf.httpPort}`);