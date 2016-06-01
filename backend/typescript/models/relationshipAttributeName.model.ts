import * as mongoose from 'mongoose';
import {ICodeDecode, CodeDecodeSchema} from './base';

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

    public static values():IdentityType[] {
        return RelationshipAttributeNameDomain.AllValues;
    }

    public static valueOf(name:String):IdentityType {
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

export interface IRelationshipAttributeName extends ICodeDecode {
    domain: string;
    purposeText: string;
    permittedValues: string[];
    domainEnum(): RelationshipAttributeNameDomain;
}

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

RelationshipAttributeNameSchema.method('domainEnum', function () {
    return RelationshipAttributeNameDomain.valueOf(this.domain);
});

export interface IRelationshipAttributeNameModel extends mongoose.Model<IRelationshipAttributeName> {
    findByCodeIgnoringDateRange: (id:String) => mongoose.Promise<IRelationshipAttributeName>;
    findByCodeInDateRange: (id:String) => mongoose.Promise<IRelationshipAttributeName>;
    listInDateRange: () => mongoose.Promise<IRelationshipAttributeName[]>;
}

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

export const RelationshipAttributeNameModel = mongoose.model(
    'RelationshipAttributeName',
    RelationshipAttributeNameSchema) as IRelationshipAttributeNameModel;
