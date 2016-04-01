## Party
### Retrieve

    GET http://host/api/1/Party/Identity/{value}/{type}

e.g.

    GET http://host/api/1/Party/Identity/51824753556/abn
    
Returns:

    roles:      [{
      name:                 string,
      attributes:           {},
      sharingAgencyIds:     [string]
    }...],
    identities: [{
      type:                 string,   // "abn", scheme, ...
      value:                string,   // abn, scheme link id
      agencyId:             string,
      //The Identity "provider" will supply a name by which to refer to
      // the party.  TBD whether RAM this record this from ABN or WofG CSPs.   
      name:                 string
    }],
    attributes:             {},
    deleted:                boolean

### Create New Party

    POST http://host/api/1/Party
    
**Body**: as for GET.

Note that party must include one identity or it cannot be found again in the future.

### Update a Party

    GET http://host/api/1/Party/Identity/{value}/{type}

**Body**: Update object. This can be any partial party object:

    deleted: true

To remove an identity from a party:

    $pull: {identities: {type: "abn", value: "51824753556"}}
    
To add an identity:

    $addToSet: {identities: {type:"abn", value: "51824753556", name: "ATO"}}
    
Use the same technique to add and remove roles.