import * as mongoose from "mongoose"

export interface IRelationship extends mongoose.Document {
  /** A Subject is the party being effected (changed) by a transaction performed by the Delegate */
  type:               string;
  subjectPartyId:     string;
  subjectRole:        string;
  /** A Delegate is the party who will be interacting with government on line services on behalf of the Subject. */
  delegatePartyId:    string;
  delegateRole:       string;
  /** when does this relationship start to be usable - this will be different to the creation timestamp */
  startTimestamp:     Date;
  /** when does this relationship finish being usable */
  endTimestamp:       Date;
  /** when did this relationship get changed to being finished. */
  endEventTimestamp:  Date;
  /** is this relationship: Invalid (semantically incorrect)/ Pending/ Active/ Inactive*/
  status:             string;
  attributes:         {string: string};
  /** which agencies can see the existence of this Relationship */
  sharingAgencyIds:   [string];
  /** Party's identity (including Authorisation Code) contain names,
   * but the other party may prefer setting a different name by which to remember
   * who they are dealing with. */
  subjectsNickName:   string;
  /** Party's identity (including Authorisation Code) contain names,
   * but the other party may prefer setting a different name by which to remember
   * who they are dealing with. */
  delegatesNickName:  string;
  
  deleted:            boolean;
}
const RelationshipSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Business", "Online Service Provider"]
  },
  subjectPartyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Party' },
  subjectRole: String,
  delegatePartyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Party' },
  delegateRole: String,
  startTimestamp: Date,
  endTimestamp: Date,
  endEventTimestamp: Date,
  status: {
    type: String,
    enum: ["Invalid", "Pending", "Active", "Deleted", "Cancelled"]
  },
  attributes: {},
  sharingAgencyIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Agency' }],
  subjectsNickName: String,
  delegatesNickName: String,
  deleted:    { type: Boolean, default: false }
}, { timestamps: true })

export const model = mongoose.model("Relationship", RelationshipSchema)