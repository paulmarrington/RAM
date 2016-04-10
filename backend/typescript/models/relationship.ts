const mongoose = require('mongoose')

const RelationshipSchema = mongoose.Schema({
  /** A Subject is the party being effected (changed) by a transaction performed by the Delegate */
  type: {
    type: String,
    enum: ["Business", "Online Service Provider"]
  },
  subjectPartyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Party' },
  subjectRole: String,
  /** A Delegate is the party who will be interacting with government on line services on behalf of the Subject. */
  delegatePartyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Party' },
  delegateRoleId: String,
  /** when does this relationship start to be usable - this will be different to the creation timestamp */
  startTimestamp: Date,
  /** when does this relationship finish being usable */
  endTimestamp: Date,
  /** when did this relationship get changed to being finished. */
  endEventTimestamp: Date,
  /** is this relationship: Invalid (semantically incorrect)/ Pending/ Active/ Inactive*/
  status: {
    type: String,
    enum: ["Invalid", "Pending", "Active", "Deleted", "Cancelled"]
  },
  attributes: {},
  /** which agencies can see the existence of this Relationship */
  sharingAgencyIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Agency' }],
  /** Party's identity (including Authorisation Code) contain names,
   * but the other party may prefer setting a different name by which to remember
   * who they are dealing with. */
  subjectsNickName: String,
  /** Party's identity (including Authorisation Code) contain names,
   * but the other party may prefer setting a different name by which to remember
   * who they are dealing with. */
  delegatesNickName: String
}, { timestamps: true })

export const model = mongoose.model("Relationship", RelationshipSchema)