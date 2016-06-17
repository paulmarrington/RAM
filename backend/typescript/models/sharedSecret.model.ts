import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
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
        set: (value:String) => {
            if (value) {
                const salt = bcrypt.genSaltSync(10);
                return bcrypt.hashSync(value, salt);
            }
            return value;
        }
    },
    sharedSecretType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SharedSecretType',
        required: [true, 'Shared Secret Type is required']
    }
});

// interfaces .........................................................................................................

export interface ISharedSecret extends IRAMObject {
    value: string;
    sharedSecretType: ISharedSecretType;
    matchesValue(candidateValue:String): boolean;
}

/* tslint:disable:no-empty-interfaces */
export interface ISharedSecretModel extends mongoose.Model<ISharedSecret> {
}

// instance methods ...................................................................................................

SharedSecretSchema.method('matchesValue', function (candidateValue:String) {
    if (candidateValue && this.value) {
        return bcrypt.compareSync(candidateValue, this.value);
    }
    return false;
});

// static methods .....................................................................................................

// concrete model .....................................................................................................

export const SharedSecretModel = mongoose.model(
    'SharedSecret',
    SharedSecretSchema) as ISharedSecretModel;
