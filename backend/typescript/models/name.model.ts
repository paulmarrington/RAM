import * as mongoose from 'mongoose';
import {IRAMObject, RAMSchema} from './base';

// enums, utilities, helpers ..........................................................................................

// schema .............................................................................................................

const NameSchema = RAMSchema({
    givenName: {
        type: String,
        trim: true
    },
    familyName: {
        type: String,
        trim: true
    },
    unstructuredName: {
        type: String,
        trim: true
    }
});

// interfaces .........................................................................................................

export interface IName extends IRAMObject {
    givenName: string;
    familyName: string;
    unstructuredName: string;
}

/* tslint:disable:no-empty-interfaces */
export interface INameModel extends mongoose.Model<IName> {
}

// instance methods ...................................................................................................

// static methods .....................................................................................................

// concrete model .....................................................................................................

export const NameModel = mongoose.model(
    'Name',
    NameSchema) as INameModel;
