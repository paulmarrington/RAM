/// <reference path="../_BackendTypes.ts" />

import * as mongoose from "mongoose";
import * as cApi from "../../../commons/RamAPI";
import {logger} from "../Logger";

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
        type: Number,
        required: true
    },
    accessLevel: {
        type: Number,
        required: true
    },
    expiresOn: {
        type: Date,
        required: false
    },
});

// export interface IIndividualBusinessAuthorisation
//     extends IndividualBusinessAuthorisation, mongoose.Document {
// }

// export class IndividualBusinessAuthorisationDAO {

//     model: mongoose.Model<IIndividualBusinessAuthorisation>
//     constructor() {
//         this.model = mongoose.model<IIndividualBusinessAuthorisation>("IndividualBusinessAuthorisation");
//     }

//     getBusinessInformation(businessIds: Array<string>): Promise<IIndividualBusinessAuthorisation[]> {
//         return new Promise((resolve, reject) => {
//             this.model.find({}, (error, result) => {
//                 if (error) {
//                     logger.error(error);
//                     reject(error);
//                 } else {
//                     resolve(result);
//                 }
//             });
//         });
//     }
// }


