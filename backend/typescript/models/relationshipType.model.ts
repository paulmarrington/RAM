import * as mongoose from 'mongoose';
import {ICodeDecode, CodeDecodeSchema} from './base';
import {IRelationshipAttributeNameUsage, RelationshipAttributeNameUsageModel} from './relationshipAttributeNameUsage.model';

// force schema to load first
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
    findValidByCode: (id:String) => mongoose.Promise<IRelationshipType>;
    listValid: () => mongoose.Promise<IRelationshipType[]>;
}

RelationshipTypeSchema.static('findValidByCode', (code:String) => {
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

RelationshipTypeSchema.static('listValid', () => {
    return this.RelationshipTypeModel
        .find({
            startDate: {$lte: new Date()},
            $or: [{endDate: null}, {endDate: {$gt: new Date()}}]
        })
        .sort({name: 1})
        .exec();
});

export const RelationshipTypeModel = mongoose.model(
    'RelationshipType',
    RelationshipTypeSchema) as IRelationshipTypeModel;
