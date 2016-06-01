import * as mongoose from 'mongoose';
import {ICodeDecode, CodeDecodeSchema} from './base';
import {RelationshipAttributeNameModel} from './relationshipAttributeName.model';
import {IRelationshipAttributeNameUsage, RelationshipAttributeNameUsageModel} from './relationshipAttributeNameUsage.model';
import {
    HrefValue,
    RelationshipType as DTO,
    RelationshipAttributeNameUsage as RelationshipAttributeNameUsageDTO
} from '../../../commons/RamAPI';

// force schema to load first
// see https://github.com/atogov/RAM/pull/220#discussion_r65115456
/* tslint:disable:no-unused-variable */
const _RelationshipAttributeNameModel = RelationshipAttributeNameModel;
/* tslint:disable:no-unused-variable */
const _RelationshipAttributeNameUsageModel = RelationshipAttributeNameUsageModel;

const RelationshipTypeSchema = CodeDecodeSchema({
    voluntaryInd: {
        type: Boolean,
        required: [true, 'Voluntary Ind is required'],
        default: false
    },
    attributeNameUsages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RelationshipAttributeNameUsage'
    }]
});

export interface IRelationshipType extends ICodeDecode {
    voluntaryInd: boolean;
    attributeNameUsages: IRelationshipAttributeNameUsage[];
    toHrefValue(): HrefValue<DTO>;
    toDTO(): DTO;
}

export interface IRelationshipTypeModel extends mongoose.Model<IRelationshipType> {
    findByCodeIgnoringDateRange: (id:String) => mongoose.Promise<IRelationshipType>;
    findByCodeInDateRange: (id:String) => mongoose.Promise<IRelationshipType>;
    listIgnoringDateRange: () => mongoose.Promise<IRelationshipType[]>;
    listInDateRange: () => mongoose.Promise<IRelationshipType[]>;
}

RelationshipTypeSchema.method('toHrefValue', function () {
    return new HrefValue(
        '/api/v1/relationshipType/' + this.code,
        this.toDTO()
    );
});

RelationshipTypeSchema.method('toDTO', function () {
    return new DTO(
        this.code,
        this.shortDecodeText,
        this.longDecodeText,
        this.startDate,
        this.endDate,
        this.voluntaryInd,
        this.attributeNameUsages.map((attributeNameUsage:IRelationshipAttributeNameUsage) => {
            return new RelationshipAttributeNameUsageDTO(
                attributeNameUsage.optionalInd,
                attributeNameUsage.defaultValue,
                attributeNameUsage.attributeName.toHrefValue()
            );
        })
    );
});

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

RelationshipTypeSchema.static('listIgnoringDateRange', () => {
    return this.RelationshipTypeModel
        .find({
        })
        .deepPopulate([
            'attributeNameUsages.attributeName'
        ])
        .sort({name: 1})
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
