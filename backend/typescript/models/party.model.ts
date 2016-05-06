/// <reference path='../_BackendTypes.ts' />
import * as mongoose from 'mongoose';
import {IRAMObject, RAMSchema} from './base';

// Due to 'Machinary of Government' changes, agencies frequently change
// their names & abbrieviations.
export interface Agency extends IRAMObject {
  currentAbbrieviation: string;
  previousAbbrieviations: string[];
  currentName: string;
  previousNames: string[];
  // to be 'privacy enhancing' myGov allocates different identifiers to
  // different agencies.  The consumer identifies the agency the
  // identifier is for (assuming it is relevant)
  consumer: string;
}
const AgencySchema = RAMSchema({
  currentAbbrieviation: { type: String, trim: true },
  previousAbbrieviations: { type: [String], default: [] },
  currentName: { type: String, trim: true },
  previousNames: { type: [String], default: [] },
  consumer: String
});

export interface IRole extends IRAMObject {
  name: string;
  attributes: { string: string };
  sharingAgencyIds: string;
}
const RoleSchema = RAMSchema({
  name: String,
  attributes: {},
  sharingAgencyIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Agency' }]
});

export interface Name extends IRAMObject {
  givenName?:         string;
  familyName?:        string;
  unstructuredName?:  string;
}

const NameSchema = RAMSchema({
  givenName:          String,
  familyName:         String,
  unstructuredName:   String
});

export interface IIdentity extends IRAMObject {
  type: string;   // 'abn', scheme, ...
  value: string;   // abn, scheme link id
  agency: Agency;  // agency the identifier is for
  //The Identity 'provider' will supply a name by which to refer to
  // the party.  TBD whether RAM this record this from ABN or WofG CSPs.   
  name: Name;
}
const IdentitySchema = RAMSchema({
  type:   String,
  value:  String,
  agency: AgencySchema,
  name:   NameSchema
});

// A Party is the concept that participates in Relationships.
/* see https://books.google.com.au/books?id=_fSVKDn7v04C&lpg=PP1&
   dq=enterprise%20patterns%20and%20mda%20chapter%20party%20relationship&
   pg=RA1-PA159#v=onepage
   q=enterprise%20patterns%20and%20mda%20chapter%20party%20relationship&
   f=false
 */
export interface IParty extends IRAMObject {
  roles: IRole[];
  identities: IIdentity[];
  attributes: { string: string };
  deleted: boolean;
}
const PartySchema = RAMSchema({
  roles: [RoleSchema],
  identities: { type: [IdentitySchema], index: true },
  attributes: {},
  deleted: { type: Boolean, default: false }
});

export interface IPartyModel extends mongoose.Model<IParty> {
  getPartyById: (id: mongoose.Types.ObjectId) => mongoose.Promise<IParty>;
  getPartyByIdentity: (identityType: string, identityValue: string) => mongoose.Promise<IParty>;
}

PartySchema.static('getPartyByIdentity', (identityType: string, identityValue: string,
  cb: (doc?: IParty) => void) =>
  this.PartyModel.findOne({
    'identities.type': identityType,
    'identities.value': identityValue,
    deleted: false
  }).exec()
);

PartySchema.static('getPartyById', (id: mongoose.Types.ObjectId) =>
  this.PartyModel.findOne({ _id: id }).exec()
);

export const PartyModel = mongoose.model('Party', PartySchema) as IPartyModel;
