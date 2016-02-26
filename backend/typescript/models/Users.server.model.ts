/// <reference path="../_BackendTypes.ts" />

import * as mongoose from "mongoose";

export interface IUser extends mongoose.Document {
    name: string;
    somethingElse?: number;
}

export const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    somethingElse: Number
});

export class User {
    model:mongoose.Model<IUser>

    constructor(){
        this.model = mongoose.model<IUser>("User");
    }
}
