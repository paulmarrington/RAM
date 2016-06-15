import * as mongoose from 'mongoose';
import {RelationshipModel} from './relationship.model';
import {IRelationshipAttributeName, RelationshipAttributeNameModel} from './relationshipAttributeName.model';
import {
    RelationshipAttribute as DTO
} from '../../../commons/RamAPI';

// force schema to load first (see https://github.com/atogov/RAM/pull/220#discussion_r65115456)

/* tslint:disable:no-unused-variable */
const _RelationshipModel = RelationshipModel;

/* tslint:disable:no-unused-variable */
const _RelationshipAttributeNameModel = RelationshipAttributeNameModel;

// enums, utilities, helpers ..........................................................................................

// schema .............................................................................................................

const RelationshipAttributeSchema = new mongoose.Schema({
    value: {
      type: String,
      required: false,
      trim: true
    },
    attributeName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RelationshipAttributeName',
        required: true
    }
});

// interfaces .........................................................................................................

export interface IRelationshipAttribute extends mongoose.Document {
    value?: string;
    attributeName: IRelationshipAttributeName;
    toDTO():Promise<DTO>;
}

/* tslint:disable:no-empty-interfaces */
export interface IRelationshipAttributeModel extends mongoose.Model<IRelationshipAttribute> {
}

// instance methods ...................................................................................................

RelationshipAttributeSchema.method('toDTO', async function () {
    return new DTO(
        this.value,
        await this.attributeName.toHrefValue(true)
    );
});

// static methods .....................................................................................................

// concrete model .....................................................................................................

export const RelationshipAttributeModel = mongoose.model(
    'RelationshipAttribute',
    RelationshipAttributeSchema) as IRelationshipAttributeModel;
