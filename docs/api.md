## Party
### Retrieve

    GET http://host/api/1/party/identity/{value}/{type}

e.g.

    GET http://host/api/1/party/identity/51824753556/abn
    
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

    POST http://host/api/1/party
    
**Body**: as for GET.

Note that party must include one identity or it cannot be found again in the future.

### Update a Party

    PUT http://host/api/1/party/identity/{value}/{type}

**Body**: Update object. This can be any partial party object:

    deleted: true

To remove an identity from a party:

    $pull: {identities: {type: "abn", value: "51824753556"}}
    
To add an identity:

    $addToSet: {identities: {type:"abn", value: "51824753556", name: "ATO"}}
    
Use the same technique to add and remove roles.

## Relationship

### Retrieve Relationship

    GET http://host/api/1/relationship/{RelId}

e.g.

    GET http://host/api/1/relationship/570b2f98f7d1d96813bdd456
    
Returns:
    "_id" : "570c866b64457f7c32907806", 
    "updatedAt" : ISODate("2016-04-12T05:23:55.087+0000"), 
    "createdAt" : ISODate("2016-04-12T05:23:55.087+0000"), 
    "type" : "Business", 
    "subjectPartyId" : "570c866b64457f7c32907800", 
    "delegatePartyId" : "570c866b64457f7c32907803", 
    "startTimestamp" : ISODate("2016-04-12T05:23:55.081+0000"), 
    "endTimestamp" : ISODate("2016-04-12T05:23:55.000+0000"), 
    "status" : "Active", 
    "attributes" : {
        "delegate_abn" : "51824753556"
    }, 
    "deleted" : false, 
    "sharingAgencyIds" : [
    ]

### List Relationship for a Party

    GET http://host/api/1/relationship/list/delegate/{PartyId}/page/{pageNo/size/{itemsPerPage}

e.g.

    GET http://host/api/1/relationship/list/570c866b64457f7c32907800/delegate/{PartyId}/page/0/size/50
    
Returns:

An array of relationships as above


### Create New Relationship

    POST http://host/api/1/relationship
    
**Body**: 
    "type" : "Business", 
    "subjectPartyId" : "570c866b64457f7c32907800", 
    "delegatePartyId" : "570c866b64457f7c32907803", 
    "startTimestamp" : ISODate("2016-04-12T05:23:55.081+0000"), 
    "endTimestamp" : ISODate("2016-04-12T05:23:55.000+0000"), 
    "status" : "Active", 
    "attributes" : {
        "delegate_abn" : "51824753556"
    }, 
    "sharingAgencyIds" : [
    ]

### Update a Relationship

    PUT http://host/api/1/relationship/{RelId}

**Body**: Update object. This can be any partial party object:

    { "deleted": true }

To change end time:

    { "endTimestamp": new Date() }

### UI - Breadcrumb

    GET http://host/api/1/relationship/path/identityId/relationshipId/...

e.g.

    GET http://host/api/1/relationship/path/570eeb715a5c40f047f42576/570eeb715a5c40f047f4257c/570eeb715a5c40f047f4257d

Returns:

    partyChain: [{
      id:    570eeb715a5c40f047f4257d,
      name:  "Abacus",
      subName: "1234467900"
    },...]