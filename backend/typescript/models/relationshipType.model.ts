import * as mongoose from 'mongoose';
import {ICodeDecode, CodeDecodeSchema} from './base';

/* tslint:disable:no-var-requires */
const mongooseIdValidator = require('mongoose-id-validator');

export interface IRelationshipType extends ICodeDecode {
    voluntaryInd: boolean;
}

const RelationshipTypeSchema = CodeDecodeSchema({

    voluntaryInd: {
        type: Boolean,
        default: false
    }

});

RelationshipTypeSchema.plugin(mongooseIdValidator);

export interface IRelationshipTypeModel extends mongoose.Model<IRelationshipType> {
    findValidById: (id:String) => mongoose.Promise<IRelationshipType>;
    listValid: () => mongoose.Promise<IRelationshipType[]>;
}

RelationshipTypeSchema.static('findValidById', (id:String) => {
    return this.RelationshipTypeModel
        .findOne({
            _id: id,
            startDate: {$lte: new Date()},
            $or: [{endDate: null}, {endDate: {$gt: new Date()}}]
        })
        .exec();
});

RelationshipTypeSchema.static('listValid', (id:String) => {
    return this.RelationshipTypeModel
        .find({
            startDate: {$lte: new Date()},
            $or: [{endDate: null}, {endDate: {$gt: new Date()}}]
        })
        .sort({name: 1})
        .exec();
});

export const RelationshipTypeModel = mongoose.model('RelationshipType', RelationshipTypeSchema) as IRelationshipTypeModel;
