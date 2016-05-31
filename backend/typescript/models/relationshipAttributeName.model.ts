import * as mongoose from 'mongoose';
import {ICodeDecode, CodeDecodeSchema} from './base';

export const RelationshipAttributeNameNullDomain = 'null';
export const RelationshipAttributeNameBooleanDomain = 'boolean';
export const RelationshipAttributeNameNumberDomain = 'number';
export const RelationshipAttributeNameStringDomain = 'string';
export const RelationshipAttributeNameDateDomain = 'date';
export const RelationshipAttributeNameSingleSelectDomain = 'select_single';
export const RelationshipAttributeNameMultiSelectDomain = 'select_multi';

export const RelationshipAttributeNameDomains = [
    RelationshipAttributeNameNullDomain,
    RelationshipAttributeNameBooleanDomain,
    RelationshipAttributeNameNumberDomain,
    RelationshipAttributeNameStringDomain,
    RelationshipAttributeNameDateDomain,
    RelationshipAttributeNameSingleSelectDomain,
    RelationshipAttributeNameMultiSelectDomain
];

export interface IRelationshipAttributeName extends ICodeDecode {
    domain: string;
    purposeText: string;
    permittedValues: string[];
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
    },
    permittedValues: [{
        type: String
    }]
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
