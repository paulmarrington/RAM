import * as mongoose from 'mongoose';
import {ICodeDecode, CodeDecodeSchema} from './base';
import {HrefValue, RelationshipAttributeName as DTO} from '../../../commons/RamAPI';

// enums, utilities, helpers ..........................................................................................

// see https://github.com/atogov/RAM/wiki/Relationship-Attribute-Types
export class RelationshipAttributeNameDomain {

    public static Null = new RelationshipAttributeNameDomain('NULL');
    public static Boolean = new RelationshipAttributeNameDomain('BOOLEAN');
    public static Number = new RelationshipAttributeNameDomain('NUMBER');
    public static String = new RelationshipAttributeNameDomain('STRING');
    public static Date = new RelationshipAttributeNameDomain('DATE');
    public static SelectSingle = new RelationshipAttributeNameDomain('SELECT_SINGLE');
    public static SelectMulti = new RelationshipAttributeNameDomain('SELECT_MULTI');

    public static AllValues = [
        RelationshipAttributeNameDomain.Null,
        RelationshipAttributeNameDomain.Boolean,
        RelationshipAttributeNameDomain.Number,
        RelationshipAttributeNameDomain.String,
        RelationshipAttributeNameDomain.Date,
        RelationshipAttributeNameDomain.SelectSingle,
        RelationshipAttributeNameDomain.SelectMulti
    ];

    public static values():RelationshipAttributeNameDomain[] {
        return RelationshipAttributeNameDomain.AllValues;
    }

    public static valueOf(name:String):RelationshipAttributeNameDomain {
        for (let type of RelationshipAttributeNameDomain.AllValues) {
            if (type.name === name) {
                return type;
            }
        }
        return null;
    }

    public static valueStrings():String[] {
        return RelationshipAttributeNameDomain.AllValues.map((value) => value.name);
    }

    constructor(public name:String) {
    }
}

// schema .............................................................................................................

const RelationshipAttributeNameSchema = CodeDecodeSchema({
    domain: {
        type: String,
        required: [true, 'Domain is required'],
        trim: true,
        enum: RelationshipAttributeNameDomain.valueStrings()
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

// interfaces .........................................................................................................

export interface IRelationshipAttributeName extends ICodeDecode {
    domain: string;
    purposeText: string;
    permittedValues: string[];
    domainEnum(): RelationshipAttributeNameDomain;
    toHrefValue(): HrefValue<DTO>;
    toDTO(): DTO;
}

export interface IRelationshipAttributeNameModel extends mongoose.Model<IRelationshipAttributeName> {
    findByCodeIgnoringDateRange: (id:String) => mongoose.Promise<IRelationshipAttributeName>;
    findByCodeInDateRange: (id:String) => mongoose.Promise<IRelationshipAttributeName>;
    listIgnoringDateRange: () => mongoose.Promise<IRelationshipAttributeName[]>;
    listInDateRange: () => mongoose.Promise<IRelationshipAttributeName[]>;
}

// instance methods ...................................................................................................

RelationshipAttributeNameSchema.method('domainEnum', function () {
    return RelationshipAttributeNameDomain.valueOf(this.domain);
});

RelationshipAttributeNameSchema.method('toHrefValue', function () {
    return new HrefValue(
        '/api/v1/relationshipAttributeName/' + this.code,
        this.toDTO()
    );
});

RelationshipAttributeNameSchema.method('toDTO', function () {
    return new DTO(
        this.code,
        this.shortDecodeText,
        this.longDecodeText,
        this.startDate,
        this.endDate,
        this.shortDecodeText,
        this.domain,
        this.permittedValues
    );
});

// static methods .....................................................................................................

RelationshipAttributeNameSchema.static('findByCodeIgnoringDateRange', (code:String) => {
    return this.RelationshipAttributeNameModel
        .findOne({
            code: code
        })
        .exec();
});

RelationshipAttributeNameSchema.static('findByCodeInDateRange', (code:String) => {
    return this.RelationshipAttributeNameModel
        .findOne({
            code: code,
            startDate: {$lte: new Date()},
            $or: [{endDate: null}, {endDate: {$gt: new Date()}}]
        })
        .exec();
});

RelationshipAttributeNameSchema.static('listIgnoringDateRange', () => {
    return this.RelationshipAttributeNameModel
        .find({
        })
        .deepPopulate([
            'attributeNameUsages.attributeName'
        ])
        .sort({name: 1})
        .exec();
});

RelationshipAttributeNameSchema.static('listInDateRange', () => {
    return this.RelationshipAttributeNameModel
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

// concrete model .....................................................................................................

export const RelationshipAttributeNameModel = mongoose.model(
    'RelationshipAttributeName',
    RelationshipAttributeNameSchema) as IRelationshipAttributeNameModel;
