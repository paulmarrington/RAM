/// <reference path='../_BackendTypes.ts' />
import * as mongoose from 'mongoose';
import {IRAMObject, RAMSchema} from './base';
/* tslint:disable:no-var-requires */ const mongooseIdValidator = require('mongoose-id-validator');

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
  currentAbbreviation: {
    type: String,
    trim: true,
    minLength: [2, 'Agency abbreviation must have at least two characters'],
    maxLength: [10, 'Agency abbreviation must have at most 10 characters'],
    required: [true, 'agency abbreviation required']
  },
  previousAbbrieviations: {
    type: [String],
    default: [],
    required: true
  },
  currentName: {
    type: String,
    trim: true,
    minLength: [2, 'Agency name must have at least two characters'],
    required: [true, 'Agency name required'],
    maxLength: [64, 'Agency name must have at most 64 characters']
  },
  previousNames: {
    type: [String],
    default: [],
    required: true
  },
  consumer: {
    type: String,
    trim: true,
    minLength: [2, 'Agency name must have at least two characters'],
    maxLength: [64, 'Agency name must have at most 64 characters'],
  }
});

export interface IRole extends IRAMObject {
  name: string;
  attributes: { string: string };
  sharingAgencyIds: string;
}
const RoleSchema = RAMSchema({
  name: {
    type: String,
    trim: true,
    required: [true, 'A role must have a name']
  },
  attributes: {},
  sharingAgencyIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agency'
  }]
});

export interface Name extends IRAMObject {
  givenName?: string;
  familyName?: string;
  unstructuredName?: string;
}

const NameSchema = RAMSchema({ // todo: validate the Validation required, cross structural, givenName/familyName OR unstructuredName
  givenName: {
    trim: true,
    type: String
  },
  familyName: {
    trim: true,
    type: String
  },
  unstructuredName: {
    trim: true,
    type: String
  },
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
  type: {
    type: String,
    trim: true,
    required: [true, 'Identity type required']
  },
  value: {
    type: String,
    trim: true,
    required: [true, 'Identity value required']
  },
  agency: {
    type: AgencySchema
  },
  name: {
    type: NameSchema,
    required: [true, 'Identity must have a name']
  }
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
}
const PartySchema = RAMSchema({
  roles: {
    type: [RoleSchema]
  },
  identities: {
    type: [IdentitySchema],
    minLength: [1, 'A party must have at least one identity'],
    required: [true, 'A party must have at least one identity'],
    index: true
  },
  attributes: {},
});

PartySchema.plugin(mongooseIdValidator);

export interface IPartyModel extends mongoose.Model<IParty> {
  getPartyById: (id: mongoose.Types.ObjectId) => mongoose.Promise<IParty>;
  getPartyByIdentity: (identityType: string, identityValue: string) => mongoose.Promise<IParty>;
}

PartySchema.static('getPartyByIdentity', (identityType: string, identityValue: string) =>
  this.PartyModel.findOne({
    'identities.type': identityType,
    'identities.value': identityValue
  }).exec()
);

PartySchema.static('getPartyById', (id: mongoose.Types.ObjectId) =>
  this.PartyModel.findOne({ _id: id }).exec()
);

export const PartyModel = mongoose.model('Party', PartySchema) as IPartyModel;