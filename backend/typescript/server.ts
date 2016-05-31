import * as express from 'express';
import * as path from 'path';
import * as loggerMorgan from 'morgan';
import * as bodyParser from 'body-parser';
import * as methodOverride from 'method-override';
import * as cApi from '../../commons/RamAPI';
import * as mongoose from 'mongoose';
import {conf} from './bootstrap';
import {logStream} from './logger';
// import {continueOnlyIfJWTisValid} from './security'
import expressValidator = require('express-validator');

import {PartyController} from './controllers/party.controller';
import {RelationshipController} from './controllers/relationship.controller';
import {RelationshipTypeController} from './controllers/relationshipType.controller';
import {ResetController} from './controllers/reset.server.controller';

import {PartyModel} from './models/party-old.model';
import {RelationshipModel} from './models/relationship-old.model';
import {RelationshipTypeModel} from './models/relationshipType.model';

// connect to the database ............................................................................................

mongoose.connect(conf.mongoURL, {}, () => {
    console.log('Connected to db: ' + conf.mongoURL);
});

// configure express ..................................................................................................

const server = express();

switch (conf.devMode) {
    case false:
        // todo: Log to file: https://github.com/expressjs/morgan
        server.use(loggerMorgan('prod', { stream: logStream }));
        break;
    default:
        server.set('json spaces', 2);
        server.use(loggerMorgan('dev', { stream: logStream }));
        break;
}

server.use(bodyParser.json());
server.use(expressValidator({
    customValidators: {
        exampleValidator: (value: string) => {
            return value === 'yes';
        }
    }
}));

server.use(bodyParser.urlencoded({ extended: true }));
server.use(methodOverride());

// server.use(continueOnlyIfJWTisValid(conf.jwtSecretKey,true));

server.use(express.static(path.join(__dirname, conf.frontendDir)));
server.use(express.static('swagger'));

// setup route handlers ...............................................................................................

server.use('/api/reset',
    new ResetController().assignRoutes(express.Router()));
server.use('/api/v1/party',
    new PartyController(PartyModel).assignRoutes(express.Router()));
server.use('/api/',
    new RelationshipController(RelationshipModel, PartyModel).assignRoutes(express.Router()));
server.use('/api/',
    new RelationshipTypeController(RelationshipTypeModel).assignRoutes(express.Router()));

// catch 404 and forward to error handler
server.use((req: express.Request, res: express.Response) => {
    const err = new cApi.ErrorResponse(404, 'Request Not Found');
    res.send(err);
});

// server.use((ramResponse: cApi.IResponse, req: express.Request, res: express.Response, next: express.NextFunction) => {
//     if (ramResponse.isError) {
//         res.send(ramResponse); // Todo: More specific error handling
//     } else {
//         res.send(ramResponse);
//     }
// });

// start server .......................................................................................................

server.listen(conf.httpPort);
console.log(`RAM Server running on port ${conf.httpPort}`);