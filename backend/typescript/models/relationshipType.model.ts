import * as mongoose from 'mongoose';
import {ICodeDecode, CodeDecodeSchema} from './base';
import {IRelationshipAttributeNameUsage, RelationshipAttributeNameUsageModel} from './relationshipAttributeNameUsage.model';

// force schema to load first
// see https://github.com/atogov/RAM/pull/220#discussion_r65115456
/* tslint:disable:no-unused-variable */
const _RelationshipAttributeNameUsageModel = RelationshipAttributeNameUsageModel;

export interface IRelationshipType extends ICodeDecode {
    voluntaryInd: boolean;
    attributeNameUsages: IRelationshipAttributeNameUsage[];
}

const RelationshipTypeSchema = CodeDecodeSchema({
    voluntaryInd: {
        type: Boolean,
        default: false
    },
    attributeNameUsages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RelationshipAttributeNameUsage'
    }]
});

export interface IRelationshipTypeModel extends mongoose.Model<IRelationshipType> {
    findByCodeIgnoringDateRange: (id:String) => mongoose.Promise<IRelationshipType>;
    findByCodeInDateRange: (id:String) => mongoose.Promise<IRelationshipType>;
    listInDateRange: () => mongoose.Promise<IRelationshipType[]>;
}

RelationshipTypeSchema.static('findByCodeIgnoringDateRange', (code:String) => {
    return this.RelationshipTypeModel
        .findOne({
            code: code
        })
        .deepPopulate([
            'attributeNameUsages.attributeName'
        ])
        .exec();
});

RelationshipTypeSchema.static('findByCodeInDateRange', (code:String) => {
    return this.RelationshipTypeModel
        .findOne({
            code: code,
            startDate: {$lte: new Date()},
            $or: [{endDate: null}, {endDate: {$gt: new Date()}}]
        })
        .deepPopulate([
            'attributeNameUsages.attributeName'
        ])
        .exec();
});

RelationshipTypeSchema.static('listInDateRange', () => {
    return this.RelationshipTypeModel
        .find({
            startDate: {$lte: new Date()},
            $or: [{endDate: null}, {endDate: {$gt: new Date()}}]
        })
        .deepPopulate([
            'attributeNameUsages.attributeName'
        ])
        .sort({name: 1})
        .exec();
});

export const RelationshipTypeModel = mongoose.model(
    'RelationshipType',
    RelationshipTypeSchema) as IRelationshipTypeModel;
