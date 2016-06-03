import * as mongoose from 'mongoose';
import {ICodeDecode, CodeDecodeSchema} from './base';

// enums, utilities, helpers ..........................................................................................

// schema .............................................................................................................

const SharedSecretTypeSchema = CodeDecodeSchema({
    domain: {
        type: String,
        required: [true, 'Domain is required'],
        trim: true
    }
});

// interfaces .........................................................................................................

export interface ISharedSecretType extends ICodeDecode {
    domain: string;
}

export interface ISharedSecretTypeModel extends mongoose.Model<ISharedSecretType> {
    findByCodeIgnoringDateRange: (id:String) => mongoose.Promise<ISharedSecretType>;
    findByCodeInDateRange: (id:String) => mongoose.Promise<ISharedSecretType>;
    listIgnoringDateRange: () => mongoose.Promise<ISharedSecretType[]>;
    listInDateRange: () => mongoose.Promise<ISharedSecretType[]>;
}

// instance methods ...................................................................................................

// static methods .....................................................................................................

SharedSecretTypeSchema.static('findByCodeIgnoringDateRange', (code:String) => {
    return this.SharedSecretTypeModel
        .findOne({
            code: code
        })
        .exec();
});

SharedSecretTypeSchema.static('findByCodeInDateRange', (code:String) => {
    return this.SharedSecretTypeModel
        .findOne({
            code: code,
            startDate: {$lte: new Date()},
            $or: [{endDate: null}, {endDate: {$gt: new Date()}}]
        })
        .exec();
});

SharedSecretTypeSchema.static('listIgnoringDateRange', () => {
    return this.SharedSecretTypeModel
        .find({
        })
        .sort({name: 1})
        .exec();
});

SharedSecretTypeSchema.static('listInDateRange', () => {
    return this.SharedSecretTypeModel
        .find({
            startDate: {$lte: new Date()},
            $or: [{endDate: null}, {endDate: {$gt: new Date()}}]
        })
        .sort({name: 1})
        .exec();
});

// concrete model .....................................................................................................

export const SharedSecretTypeModel = mongoose.model(
    'SharedSecretType',
    SharedSecretTypeSchema) as ISharedSecretTypeModel;
