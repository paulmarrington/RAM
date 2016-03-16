/// <reference path="../_BackendTypes.ts" />

import * as mongoose from "mongoose";
import * as cApi from "../../../commons/RamAPI";

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

