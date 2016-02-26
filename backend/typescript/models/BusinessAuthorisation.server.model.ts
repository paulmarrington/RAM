/// <reference path="../_BackendTypes.ts" />

import * as mongoose from "mongoose";
import {IndividualBusinessAuthorisation} from "../../../commons/RamAPI";
import * as enums from "../../../commons/RamEnums";
import {LoggerInstance} from "winston";

export const IndividualBusinessAuthorisationSchema = new mongoose.Schema({
    businessName: {
        type: String,
        required: true
    },
    abn: {
        type: String,
        required: true
    },
    activeOn: {
        type: Date,
        required: true
    },
    authorisationStatus: {
        type: enums.AuthorisationStatus,
        required: true
    },
    accessLevel: {
        type: enums.AccessLevels,
        required: true
    },
    expiresOn: {
        type: Date,
        required: false
    },
});

export interface IIndividualBusinessAuthorisation
    extends IndividualBusinessAuthorisation, mongoose.Document {
}

export class IndividualBusinessAuthorisationDAO {

    model: mongoose.Model<IIndividualBusinessAuthorisation>
    constructor(private logger:LoggerInstance) {
        this.model = mongoose.model<IIndividualBusinessAuthorisation>("IndividualBusinessAuthorisation");
    }

    getBusinessInformation(businessIds: Array<string>): Promise<IIndividualBusinessAuthorisation[]> {
        return new Promise((resolve, reject) => {
            this.model.find({}, (error, result) => {
                if (error) {
                    this.logger.error(error);
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
    }
}


