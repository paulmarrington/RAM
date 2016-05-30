import * as mongoose from 'mongoose';
import {ICodeDecode, CodeDecodeSchema} from './base';

export const RelationshipAttributeNameNullDomain = 'NULL';
export const RelationshipAttributeNameBooleanDomain = 'BOOLEAN';
export const RelationshipAttributeNameNumberDomain = 'NUMBER';
export const RelationshipAttributeNameStringDomain = 'STRING';
export const RelationshipAttributeNameDateDomain = 'DATE';
export const RelationshipAttributeNameSingleSelectDomain = 'SINGLE_SELECT';
export const RelationshipAttributeNameMultiSelectDomain = 'MULTI_SELECT';

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
}

RelationshipAttributeNameSchema.static('findByCode', (code:String) => {
    return this.RelationshipAttributeNameModel
        .findOne({
            code: code
        })
        .exec();
});

export const RelationshipAttributeNameModel = mongoose.model(
    'RelationshipAttributeName',
    RelationshipAttributeNameSchema) as IRelationshipAttributeNameModel;
