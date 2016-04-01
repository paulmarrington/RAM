const mongoose = require('mongoose')

// Due to "Machinary of Government" changes, agencies frequently change
// their names & abbrieviations.
const AgencySchema = mongoose.Schema({
    currentAbbrieviation:   { type : String, trim : true },
    previousAbbrieviations: { type: [String], default: [] },
    currentName:            { type : String, trim : true },
    previousNames:          { type: [String], default: [] },
    // to be "privacy enhancing" myGov allocates different identifiers to
    // different agencies.  The consumer identifies the agency the
    // identifier is for (assuming it is relevant)
    consumer:               String
})

const RoleSchema = mongoose.Schema({
  name:                 String,
  attributes:           {},
  sharingAgencyIds:     [{type:mongoose.Schema.Types.ObjectId, ref:'Agency'}]
})

const IdentitySchema = mongoose.Schema({
  type:                   String,   // "abn", scheme, ...
  value:                  String,   // abn, scheme link id
  agency:                 AgencySchema,   // agency the identifier is for
  //The Identity "provider" will supply a name by which to refer to
  // the party.  TBD whether RAM this record this from ABN or WofG CSPs.   
  name:                   String
})

// A Party is the concept that participates in Relationships.
// see https://books.google.com.au/books?id=_fSVKDn7v04C&lpg=PP1&dq=enterprise%20patterns%20and%20mda%20chapter%20party%20relationship&pg=RA1-PA159#v=onepage&q=enterprise%20patterns%20and%20mda%20chapter%20party%20relationship&f=false  
const PartySchema = mongoose.Schema({
  roles:      [RoleSchema],
  identities: { type: [IdentitySchema], index: true },
  attributes: {},
  deleted:    { type: Boolean, default: false }
})

export const model = mongoose.model("Party", PartySchema)