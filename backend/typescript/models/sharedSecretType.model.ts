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
    findByCodeIgnoringDateRange: (code:String) => Promise<ISharedSecretType>;
    findByCodeInDateRange: (code:String, date:Date) => Promise<ISharedSecretType>;
    listIgnoringDateRange: () => Promise<ISharedSecretType[]>;
    listInDateRange: (date:Date) => Promise<ISharedSecretType[]>;
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

SharedSecretTypeSchema.static('findByCodeInDateRange', (code:String, date:Date) => {
    return this.SharedSecretTypeModel
        .findOne({
            code: code,
            startDate: {$lte: date},
            $or: [{endDate: null}, {endDate: {$gte: date}}]
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

SharedSecretTypeSchema.static('listInDateRange', (date:Date) => {
    return this.SharedSecretTypeModel
        .find({
            startDate: {$lte: date},
            $or: [{endDate: null}, {endDate: {$gte: date}}]
        })
        .sort({name: 1})
        .exec();
});

// concrete model .....................................................................................................

export const SharedSecretTypeModel = mongoose.model(
    'SharedSecretType',
    SharedSecretTypeSchema) as ISharedSecretTypeModel;
