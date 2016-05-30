import * as mongoose from 'mongoose';
import {IRelationshipAttributeName, RelationshipAttributeNameModel} from './relationshipAttributeName.model';

// force schema to load first
/* tslint:disable:no-unused-variable */
const _RelationshipAttributeNameModel = RelationshipAttributeNameModel;

export interface IRelationshipAttributeNameUsage extends mongoose.Document {
    optionalInd: boolean;
    defaultValue: string;
    attributeName: IRelationshipAttributeName;
}

const RelationshipAttributeNameUsageSchema = new mongoose.Schema({
    optionalInd: {
        type: Boolean,
        default: false
    },
    defaultValue: {
      type: String,
      required: [false, 'Default Value'],
      trim: true
    },
    attributeName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RelationshipAttributeName'
    }
});

/* tslint:disable:no-empty-interfaces */
export interface IRelationshipAttributeNameUsageModel extends mongoose.Model<IRelationshipAttributeNameUsage> {
}

export const RelationshipAttributeNameUsageModel = mongoose.model(
    'RelationshipAttributeNameUsage',
    RelationshipAttributeNameUsageSchema) as IRelationshipAttributeNameUsageModel;
