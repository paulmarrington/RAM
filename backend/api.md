## Server-side Internal APIs

### Party

#### GET /api/party?type=yyy&value=xxxxxxxx

Where _type_ is the type of identity and _value_ is the string party
identifier - specific to the identity type. Types can be -

* **abn**: with the abn (without spaces) as the associated value
* **csp**:  A LinkId is the value supplied by a Whole of Government Credential Service Provider (CSP) to RAM.  It will consist of up to 3 components separated by :: - being _identifier::scheme::consumer_
  * **identifier**: this is the actual identifier value.  This will be a string of arbitary value allocated by the CSP
  * **scheme**: this is a reference to the CSP that owns the identifer.  This has been called "scheme" to align with SBR Taxonomy
  * **consumer**: (optional) to be "privacy enhancing" myGov allocates different identifiers to different agencies.  The consumer identifies the agency the identifier is for (assuming it is relevant)
  
The get operation retrieves a JSON object with _party_ and _identities_
entries. See RamDTO for contents.

    {
      party:      Party,
      identities: Identity[]
    }
    
#### POST /api/party

The body contains a JSON object that can either be an Identity attached
to an existing party or an object containing _party_ and _identity_ entries
to create a new party.

#### PUT /api/party?_id=partyId

Given the identity for a party, take the JSON body and update by changing
the _roles_ and/or _attributes_ elements.

#### DELETE /api/party?_id=identityId

Set the deleted flag to mark identities as no longer valid. Parties cannot
be deleted.