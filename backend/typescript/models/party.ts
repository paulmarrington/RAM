/// <reference path="../_BackendTypes.ts" />
import * as mongoose from "mongoose"

// Due to "Machinary of Government" changes, agencies frequently change
// their names & abbrieviations.
export interface IAgency extends mongoose.Document {
  currentAbbrieviation:   string;
  previousAbbrieviations: string[];
  currentName:            string;
  previousNames:          string[];
  // to be "privacy enhancing" myGov allocates different identifiers to
  // different agencies.  The consumer identifies the agency the
  // identifier is for (assuming it is relevant)
  consumer:               string;
}
const AgencySchema = new mongoose.Schema({
  currentAbbrieviation:   { type : String, trim : true },
  previousAbbrieviations: { type: [String], default: [] },
  currentName:            { type : String, trim : true },
  previousNames:          { type: [String], default: [] },
  consumer:               String
})

export interface IRole extends mongoose.Document {
  name:                 string;
  attributes:           {string: string};
  sharingAgencyIds:     string;
}
const RoleSchema = new mongoose.Schema({
  name:                 String,
  attributes:           {},
  sharingAgencyIds:     [{type:mongoose.Schema.Types.ObjectId, ref:'Agency'}]
})

export interface IIdentity extends mongoose.Document {
  type:                   string;   // "abn", scheme, ...
  value:                  string;   // abn, scheme link id
  agency:                 IAgency;  // agency the identifier is for
  //The Identity "provider" will supply a name by which to refer to
  // the party.  TBD whether RAM this record this from ABN or WofG CSPs.   
  name:                   string;
}
const IdentitySchema = new mongoose.Schema({
  type:                   String,
  value:                  String,
  agency:                 AgencySchema,
  name:                   String
}, {timestamps: true})

// A Party is the concept that participates in Relationships.
// see https://books.google.com.au/books?id=_fSVKDn7v04C&lpg=PP1&dq=enterprise%20patterns%20and%20mda%20chapter%20party%20relationship&pg=RA1-PA159#v=onepage&q=enterprise%20patterns%20and%20mda%20chapter%20party%20relationship&f=false  
export interface IParty extends mongoose.Document {
  roles:      IRole[];
  identities: IIdentity[];
  attributes: {string: string};
  deleted:    boolean;
}
const PartySchema = new mongoose.Schema({
  roles:      [RoleSchema],
  identities: { type: [IdentitySchema], index: true },
  attributes: {},
  deleted:    { type: Boolean, default: false }
}, {timestamps: true})

export const model = mongoose.model("Party", PartySchema)