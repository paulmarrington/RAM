describe("a RAM Party", () => {
  it("can create a new identity and party", function(done) {
    new_party(rest.uuid()).then(function (result) {
      expect(result).toEqual(jasmine.objectContaining({ error: false }))
      done()
    }).catch(function(err) { fail(err); done() })
  })
  it("can create a new identity for an existing party", function(done) {
    new_two_identity_party().then(function(result) {
      expect(result.identities.length).toEqual(2)
      done()
    }).catch(function(err) { fail(err); done() })
  })
  it("can retrieve a party based on identity", function(done) {
    var abn = rest.uuid()
    new_party(abn).then(function (result) {
      get_party(abn).then(function (result) {
        expect(result.party).not.toBe(null)
        expect(result.identities).not.toBe(null)
        done()
      }).catch(function(err) { fail(err); done() })
    }).catch(function(err) { fail(err); done() })
  })
  it("can retrieve a list of identities for a party", function(done) {
    new_two_identity_party().then(function(result) {
      expect(result.identities.length).toEqual(2)
      done()
    }).catch(function(err) { fail(err); done() })
  })
  it("can change party roles", function(done) {
    update_party(function(data) {
      return {roles: data.roles}
    }).then(function(data) {
      expect(data.party.roles.length).toEqual(2)
      done()
    }).catch(function(err) { fail(err); done() })
  })
  it("can change party attributes", function(done) {
    update_party(function(data) {
      return {attributes: {registered: true}}
    }).then(function(data) {
      expect(data.party.attributes.registered).toEqual(true)
      done()
    }).catch(function(err) { fail(err); done() })
  })
  it("can delete identities", function(done) {
    new_two_identity_party().then(function(data) {
      var identities = data.identities
      rest.delete("party", {_id: identities[0]._id}).then(function(data) {
        get_party(identities[1].value).then(function (result) {
          expect(result.party).not.toBe(null)
          expect(result.identities.length).toEqual(1)
          done()
        }).catch(function(err) { fail(err); done() })
      }).catch(function(err) { fail(err); done() })
    }).catch(function(err) { fail(err); done() })
  })
});

rest = require("../../spec/support/rest.js")

var get_party = function(abn) {
  return rest.get("party", {type: "abn", value: abn})
}

var new_party = function(abn) {
  var documents = {
    party:    {
      roles:      [
        {name:"tax-agent", attributes:{}, sharingAgencyIds:[]}
      ],
      attributes: {}
    },
    identity: {type: "abn", value: abn}
  }
  return rest.post("party", {}, documents)
}

var new_two_identity_party = function() {
  return new Promise(function(resolve, reject) {
    var abn_1   = rest.uuid(), abn_2 = rest.uuid()
    var party_1 = new_party(abn_1)
    party_1.then(function (result) {
      get_party(abn_1).then(function (result) {
        var identity = {
          type:     "abn",
          value:    abn_2,
          partyId:  result.party._id
        }
        rest.post("party", {}, identity).then(function(result) {
          get_party(abn_2).then(function (result) { resolve(result) })
        }).catch(function(err) { reject(err) })
      }).catch(function(err) { reject(err) })
    }).catch(function(err) { reject(err) })
  })
}

var update_party = function(updates) {
  return new Promise(function(resolve, reject) {
    new_two_identity_party().then(function(result) {
      result.party.roles.push({name: "spouse"})
      var sel = {_id: result.party._id}
      rest.put("party", sel, updates(result.party)).then(function() {
        get_party(result.identities[0].value).then(function(result) {
          resolve(result)
        }).catch(function(err) { reject(err) })
      }).catch(function(err) { reject(err) })
    }).catch(function(err) { reject(err) })
  })
}
