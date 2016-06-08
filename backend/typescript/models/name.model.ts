import * as mongoose from 'mongoose';
import {IRAMObject, RAMSchema} from './base';

// enums, utilities, helpers ..........................................................................................

// schema .............................................................................................................

const NameSchema = RAMSchema({
    givenName: {
        type: String,
        trim: true,
        validate: {
            validator: function (v) {
                return !((this.givenName || this.familyName) && this.unstructuredName);
            },
            message: 'Given/Family Name and Unstructured Name cannot both be specified'
        },
        required: [function () {
            return this.familyName || !this.unstructuredName;
        }, 'Given Name or Unstructured Name is required']
    },
    familyName: {
        type: String,
        trim: true
    },
    unstructuredName: {
        type: String,
        trim: true,
        required: [function () {
            return !this.givenName && !this.familyName;
        }, 'Given Name or Unstructured Name is required']
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
