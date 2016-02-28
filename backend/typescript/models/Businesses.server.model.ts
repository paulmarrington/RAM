/// <reference path="../_BackendTypes.ts" />

import * as mongoose from "mongoose";
import {DataResponse, IndividualBusinessAuthorisation, BusinessName} from "../../../commons/RamAPI";
import * as enums from "../../../commons/RamEnums";

export const BusinessSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    abn: {
        type: String,
        required: true
    }
});


export interface IBusiness extends mongoose.Document {
    name: string;
    abn: string;
}

