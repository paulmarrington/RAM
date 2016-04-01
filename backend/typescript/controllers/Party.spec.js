describe("a RAM Party", () => {
  it("can create a new identity and party", function(done) {
    new_party(rest.uuid()).then(function (result) {
      expect(result).toEqual(jasmine.objectContaining({ deleted: false }))
      done()
    }).catch(function(err) { fail(err); done() })
  })
  it("can create a new identity for an existing party", function(done) {
    new_two_identity_party(rest.uuid()).then(function(result) {
      expect(result.identities.length).toEqual(2)
      done()
    }).catch(function(err) { fail(err); done() })
  })
  it("can retrieve a party based on identity", function(done) {
    var abn = rest.uuid()
    new_party(abn).then(function (result) {
      get_party(abn).then(function (result) {
        expect(result.identities.length).toEqual(1)
        done()
      }).catch(function(err) { fail(err); done() })
    }).catch(function(err) { fail(err); done() })
  })
  it("can retrieve a list of identities for a party", function(done) {
    new_two_identity_party(rest.uuid()).then(function(result) {
      expect(result.identities.length).toEqual(2)
      done()
    }).catch(function(err) { fail(err); done() })
  })
  it("can change party roles", function(done) {
    update_party(rest.uuid(), {
        $addToSet: {roles: {name: "spouse"}},
        $set:      {"attributes.magic": "dark"}
      }
    ).then(function(partyDoc) {
      expect(partyDoc.roles.length).toEqual(2)
      done()
    }).catch(function(err) { fail(err); done() })
  })
  it("can change party attributes", function(done) {
    update_party(rest.uuid(), {
      "attributes.magic": "light"
    }).then(function(partyDoc) {
      expect(partyDoc.attributes.magic).toEqual("light")
      done()
    }).catch(function(err) { fail(err); done() })
  })
  it("can delete identities", function(done) {
    var abn_1 = rest.uuid()
    update_party(abn_1, {
      $pull: {identities: {value:abn_1, type:"abn"}},
    }).then(function (updatedParty) {
      expect(updatedParty.identities.length).toEqual(1)
      done()
    }).catch(function(err) { fail(err); done() })
  })
});

rest = require("../../spec/support/rest.js")

var get_party = function(abn) {
  return rest.get("Party/Identity/" + abn + "/abn")
}

var new_party = function(abn) {
  var doc = {
    roles: [
      {name:"tax-agent", attributes:{}, sharingAgencyIds:[]}
    ],
    attributes: {},
    identities: [{type: "abn", value: abn, name: rest.uuid()}]
  }
  return rest.post("Party", doc)
}

var new_two_identity_party = function(abn_1) {
  return new Promise(function(resolve, reject) {
    var abn_2 = rest.uuid()
    new_party(abn_1).then(function (res_1) {
      var identity = {
        type:     "abn",
        value:    abn_2,
        name:     rest.uuid()
      }
      rest.put("Party/Identity/" + abn_1 + "/abn",
      
      {$addToSet: {identities: identity}}
      
      ).then(function(res_2) {
        resolve(res_2)
      }).catch(function(err) { reject(err) })
    }).catch(function(err) { reject(err) })
  })
}

var update_party = function(abn, updates) {
  return new Promise(function(resolve, reject) {
    new_two_identity_party(abn).then(function(partyDoc) {
      var abn = partyDoc.identities[0].value
      rest.put("Party/Identity/" + abn + "/abn", updates)
      .then(function(updatedParty) {
          resolve(updatedParty)        
      }).catch(function(err) { reject(err) })
    }).catch(function(err) { reject(err) })
  })
}
