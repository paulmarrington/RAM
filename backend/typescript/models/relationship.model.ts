import * as mongoose from 'mongoose';
import {IRAMObject, RAMSchema} from './base';
/* tslint:disable:no-var-requires */ const mongooseIdValidator = require('mongoose-id-validator');

//todo:enum
export const statusOptions = [
  'Invalid', 'Pending', 'Active', 'Deleted', 'Cancelled'
];

//todo:enum
export const accessLevels = [
  'Universal', 'Limited', 'Fixed', 'Legal Attorney'
];

export const relationshipTypes = [
  'Business', 'Online Service Provider'
];

export interface IRelationship extends IRAMObject {
  /* A Subject is the party being effected (changed) by a transaction
   * performed by the Delegate
   */
  type: string;

  subjectId: string;
  subjectName: string;
  subjectAbn: string;
  subjectRole: string;
  /** A Delegate is the party who will be interacting with government on line services on behalf of the Subject. */
  delegateId: string;
  delegateName: string;
  delegateAbn: string;
  delegateRole: string;
  /* when does thissour relationship start to be usable - this will be different to the creation timestamp */
  startTimestamp: Date;
  /* when does this relationship finish being usable */
  endTimestamp: Date;
  /* when did this relationship get changed to being finished. */
  endEventTimestamp: Date;
  /* is this relationship: Invalid (semantically incorrect)/ Pending/ Active/ Inactive*/
  status: string;
  attributes: { string: string };
  /** which agencies can see the existence of this Relationship */
  sharingAgencyIds: [string];
  /* Party's identity (including Authorisation Code) contain names,
   * but the other party may prefer setting a different name by which to remember who they are dealing with. */
  subjectsNickName: string;
  /* Party's identity (including Authorisation Code) contain names,
   * but the other party may prefer setting a different name by which to remember who they are dealing with. */
  delegatesNickName: string;

  deleted: boolean;
}
const RelationshipSchema = RAMSchema({
  type: {
    type: String,
    required: true,
    trim: true,
    enum: relationshipTypes
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Party'
  },
  subjectName: { // TODO, PAUL
    type: String,
    trim: true
  },
  subjectAbn: { // TODO, PAUL
    type: String,
    trim: true,
    default: ''
  },
  subjectRole: {
    type: String,
    trim: true,
    required: true
  },
  delegateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Party',
    required: true
  },
  delegateName: { // TODO, PAUL
    type: String,
    trim: true
  },
  delegateAbn: {// TODO, PAUL
    type: String,
    trim: true,
    default: ''
  },
  delegateRole: {
    type: String,
    trim: true,
    required: [true, 'Delegate role is required']
  },
  startTimestamp: {
    type: Date,
    required: [true, 'StartTimestamp value is required and must be in ISO format e.g., 2016-01-30']
  },
  endTimestamp: {
    type: Date // todo: endTimestamp to be after startTimestamp    
  },
  endEventTimestamp: {
    type: Date //todo: endEventTimestamp must be after startTimestamp and only when endTimestamp is provided
  },
  status: {
    type: String,
    trim: true,
    enum: statusOptions,
    required: [true, 'Relationship Status value is required'],
  },
  attributes: {

  },
  sharingAgencyIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Agency' }],
  subjectsNickName: {
    type: String,
    trim: true,
    minLength: [2, 'Nickname must have at least two characters'],
    maxLength: [30, 'Nickname must have at most 30 characters'],
  },
  delegatesNickName: {
    type: String,
    trim: true,
    minLength: [2, 'Nickname must have at least two characters'],
    maxLength: [30, 'Nickname must have at most 30 characters']
  },
  deleted: {
    type: Boolean,
    required: true,
    default: false
  }
});

RelationshipSchema.plugin(mongooseIdValidator);

export interface IRelationshipModel extends mongoose.Model<IRelationship> {
  getRelationshipById: (id: mongoose.Types.ObjectId) => mongoose.Promise<IRelationship>;
}

// called by RelationshipModel.getRelationshipById(...)
RelationshipSchema.static('getRelationshipById', (id: mongoose.Types.ObjectId) => {
  return this.RelationshipModel.findOne({ _id: id }).exec();
});

export const RelationshipModel = mongoose.model('Relationship', RelationshipSchema) as IRelationshipModel;
