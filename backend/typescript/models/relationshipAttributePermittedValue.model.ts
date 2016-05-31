import * as mongoose from 'mongoose';
import {ICodeDecode, CodeDecodeSchema} from './base';

export interface IRelationshipAttributeName extends ICodeDecode {
    domain: string;
    purposeText: string;
}

const RelationshipAttributeNameSchema = CodeDecodeSchema({
    domain: {
        type: String,
        required: [true, 'Domain is required'],
        trim: true,
        enum: RelationshipAttributeNameDomains
    },
    purposeText: {
        type: String,
        required: [true, 'Purpose Text is required'],
        trim: true
    }
});

/* tslint:disable:no-empty-interfaces */
export interface IRelationshipAttributeNameModel extends mongoose.Model<IRelationshipAttributeName> {
    findByCode: (id:String) => mongoose.Promise<IRelationshipAttributeName>;
    findValidByCode: (id:String) => mongoose.Promise<IRelationshipAttributeName>;
}

RelationshipAttributeNameSchema.static('findByCode', (code:String) => {
    return this.RelationshipAttributeNameModel
        .findOne({
            code: code
        })
        .exec();
});

RelationshipAttributeNameSchema.static('findValidByCode', (code:String) => {
    return this.RelationshipAttributeNameModel
        .findOne({
            code: code,
            startDate: {$lte: new Date()},
            $or: [{endDate: null}, {endDate: {$gt: new Date()}}]
        })
        .exec();
});

export const RelationshipAttributeNameModel = mongoose.model(
    'RelationshipAttributeName',
    RelationshipAttributeNameSchema) as IRelationshipAttributeNameModel;
