import * as mongoose from 'mongoose';
import {ICodeDecode, CodeDecodeSchema} from './base';
import {RelationshipAttributeNameModel} from './relationshipAttributeName.model';
import {IRelationshipAttributeNameUsage, RelationshipAttributeNameUsageModel} from './relationshipAttributeNameUsage.model';
import {
    HrefValue,
    RelationshipType as DTO,
    RelationshipAttributeNameUsage as RelationshipAttributeNameUsageDTO
} from '../../../commons/RamAPI';

// force schema to load first (see https://github.com/atogov/RAM/pull/220#discussion_r65115456)

/* tslint:disable:no-unused-variable */
const _RelationshipAttributeNameModel = RelationshipAttributeNameModel;

/* tslint:disable:no-unused-variable */
const _RelationshipAttributeNameUsageModel = RelationshipAttributeNameUsageModel;

// enums, utilities, helpers ..........................................................................................

// schema .............................................................................................................

const RelationshipTypeSchema = CodeDecodeSchema({
    minCredentialStrength: {
        type: Number,
        required: [true, 'Min Credential Strength is required'],
        default: 0
    },
    minIdentityStrength: {
        type: Number,
        required: [true, 'Min Identity Strength is required'],
        default: 0
    },
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

// interfaces .........................................................................................................

export interface IRelationshipType extends ICodeDecode {
    minCredentialStrength: number;
    minIdentityStrength: number;
    voluntaryInd: boolean;
    attributeNameUsages: IRelationshipAttributeNameUsage[];
    toHrefValue(includeValue:boolean): HrefValue<DTO>;
    toDTO(): DTO;
}

export interface IRelationshipTypeModel extends mongoose.Model<IRelationshipType> {
    findByCodeIgnoringDateRange: (code:String) => mongoose.Promise<IRelationshipType>;
    findByCodeInDateRange: (code:String, date:Date) => mongoose.Promise<IRelationshipType>;
    listIgnoringDateRange: () => mongoose.Promise<IRelationshipType[]>;
    listInDateRange: (date:Date) => mongoose.Promise<IRelationshipType[]>;
}

// static methods .....................................................................................................

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

RelationshipTypeSchema.static('findByCodeInDateRange', (code:String, date:Date) => {
    return this.RelationshipTypeModel
        .findOne({
            code: code,
            startDate: {$lte: date},
            $or: [{endDate: null}, {endDate: {$gte: date}}]
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

RelationshipTypeSchema.static('listInDateRange', (date:Date) => {
    return this.RelationshipTypeModel
        .find({
            startDate: {$lte: date},
            $or: [{endDate: null}, {endDate: {$gte: date}}]
        })
        .deepPopulate([
            'attributeNameUsages.attributeName'
        ])
        .sort({name: 1})
        .exec();
});

// instance methods ...................................................................................................

RelationshipTypeSchema.method('toHrefValue', function (includeValue:boolean) {
    return new HrefValue(
        '/api/v1/relationshipType/' + this.code,
        includeValue ? this.toDTO() : undefined
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
                attributeNameUsage.attributeName.toHrefValue(true)
            );
        })
    );
});

// concrete model .....................................................................................................

export const RelationshipTypeModel = mongoose.model(
    'RelationshipType',
    RelationshipTypeSchema) as IRelationshipTypeModel;
