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
        trim: true
    },
    purposeText: {
        type: String,
        required: [true, 'Purpose Text is required'],
        trim: true
    }
});

/* tslint:disable:no-empty-interfaces */
export interface IRelationshipAttributeNameModel extends mongoose.Model<IRelationshipAttributeName> {
}

export const RelationshipAttributeNameModel = mongoose.model(
    'RelationshipAttributeName',
    RelationshipAttributeNameSchema) as IRelationshipAttributeNameModel;
