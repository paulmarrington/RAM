import * as mongoose from 'mongoose';
import {IRAMObject, RAMSchema} from './base';
import {ISharedSecretType, SharedSecretTypeModel} from './sharedSecretType.model';

// force schema to load first (see https://github.com/atogov/RAM/pull/220#discussion_r65115456)

/* tslint:disable:no-unused-variable */
const _SharedSecretTypeModel = SharedSecretTypeModel;

// enums, utilities, helpers ..........................................................................................

// schema .............................................................................................................

const SharedSecretSchema = RAMSchema({
    value: {
        type: String,
        required: [true, 'Value is required'],
        trim: true
    },
    sharedSecretType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SharedSecretType',
        required: [true, 'Type is required']
    }
});

// interfaces .........................................................................................................

export interface ISharedSecret extends IRAMObject {
    value: string;
    sharedSecretType: ISharedSecretType;
}

/* tslint:disable:no-empty-interfaces */
export interface ISharedSecretModel extends mongoose.Model<ISharedSecret> {
}

// instance methods ...................................................................................................

// static methods .....................................................................................................

// concrete model .....................................................................................................

export const SharedSecretModel = mongoose.model(
    'SharedSecret',
    SharedSecretSchema) as ISharedSecretModel;
