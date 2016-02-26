/// <reference path="../_BackendTypes.ts" />

"use strict";

import {IRamConf} from "./ServerAPI";
import * as mongoose from "mongoose";
import {IUser, UserSchema} from "../models/Users.server.model";
import {IBusiness, BusinessSchema} from "../models/Businesses.server.model";
import {IIndividualBusinessAuthorisation, IndividualBusinessAuthorisationSchema} from "../models/BusinessAuthorisation.server.model";
import {LoggerInstance} from "winston";

export function register(conf: IRamConf, logger: LoggerInstance) {

    // mongoose.Promise = Promise as any;

    mongoose.connection.on("open", () => {
        mongoose.model<IUser>("User", UserSchema);
        mongoose.model<IBusiness>("Business", UserSchema);
        mongoose.model<IIndividualBusinessAuthorisation>("IndividualBusinessAuthorisation", IndividualBusinessAuthorisationSchema);
    });

    this.db = mongoose.connect(conf.mongoURL, {}, (err) => {
        if (err) {
            logger.error("[MongoDB]", err);
        } else {
            logger.info("[MongoDB]",{message:"Connected to server"});
        }
    });


}
