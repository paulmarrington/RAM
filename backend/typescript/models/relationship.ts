import * as mongoose from 'mongoose';

export const status_options = [
  'Invalid', 'Pending', 'Active', 'Deleted', 'Cancelled'
];

export interface Relationship extends mongoose.Document {
  /* A Subject is the party being effected (changed) by a transaction performed by the Delegate */
  type:               string;

  subjectId:          string;
  subjectName:        string;
  subjectAbn:         string;
  subjectRole:        string;
  /** A Delegate is the party who will be interacting with government on line services on behalf of the Subject. */
  delegateId:         string;
  delegateName:       string;
  delegateAbn:        string;
  delegateRole:       string;
  /* when does this relationship start to be usable - this will be different to the creation timestamp */
  startTimestamp:     Date;
  /* when does this relationship finish being usable */
  endTimestamp:       Date;
  /* when did this relationship get changed to being finished. */
  endEventTimestamp:  Date;
  /* is this relationship: Invalid (semantically incorrect)/ Pending/ Active/ Inactive*/
  status:             string;
  attributes:         {string: string};
  /** which agencies can see the existence of this Relationship */
  sharingAgencyIds:   [string];
  /* Party's identity (including Authorisation Code) contain names,
   * but the other party may prefer setting a different name by which to remember who they are dealing with. */
  subjectsNickName:   string;
  /* Party's identity (including Authorisation Code) contain names,
   * but the other party may prefer setting a different name by which to remember who they are dealing with. */
  delegatesNickName:  string;

  deleted:            boolean;
}
const RelationshipSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Business', 'Online Service Provider']
  },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Party' },
  subjectName: String,
  subjectAbn: {type: String, default: ''},
  subjectRole: String,
  delegateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Party' },
  delegateName: String,
  delegateAbn: {type: String, default: ''},
  delegateRole: String,
  startTimestamp: Date,
  endTimestamp: Date,
  endEventTimestamp: Date,
  status: { type: String, enum: status_options },
  attributes: {},
  sharingAgencyIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Agency' }],
  subjectsNickName: String,
  delegatesNickName: String,
  deleted:    { type: Boolean, default: false }
}, { timestamps: true });

export const model = mongoose.model('Relationship', RelationshipSchema);