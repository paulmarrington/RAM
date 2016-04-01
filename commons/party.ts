// A Party is the concept that participates in Relationships.
// see https://books.google.com.au/books?id=_fSVKDn7v04C&lpg=PP1&dq=enterprise%20patterns%20and%20mda%20chapter%20party%20relationship&pg=RA1-PA159#v=onepage&q=enterprise%20patterns%20and%20mda%20chapter%20party%20relationship&f=false  
export interface dto {
  roles:                  Role[];
  identities:             Identity[];
  attributes:             {[key: string]: string};
}

interface Identity {
  type:                   string;   // "abn", scheme, ...
  value:                  string;   // abn, scheme link id
  partyId?:               string;   // index
  agencyId?:              string;   // agency the identifier is for
  //The Identity "provider" will supply a name by which to refer to
  // the party.  TBD whether RAM this record this from ABN or WofG CSPs.   
  name:                   string;
}

// A Role is some characteristic that a Party has. Roles will only
// likely to be collected when there is something that needs to be
// build into a business rule for relationships. A Role is independant
// of relationships, e.g. you a doctor even if you have no patients.
// In essanse a Role is just a collection of attributes. 
export interface Role {
    name:                 string;
    attributes:           {[key: string]: string};
    sharingAgencyIds:     string[];
}
