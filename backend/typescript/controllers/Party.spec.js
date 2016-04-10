var partyHelper = require("../../spec/support/party")
rest = require("../../spec/support/rest.js")

describe("a RAM Party", () => {
  it("can create a new identity and party", function(done) {
    partyHelper.new_party(rest.uuid()).then(function (result) {
      expect(result).toEqual(jasmine.objectContaining({ deleted: false }))
      done()
    }).catch(function(err) { fail(err); done() })
  })
  it("can create a new identity for an existing party", function(done) {
    partyHelper.new_two_identity_party(rest.uuid()).then(function(result) {
      expect(result.identities.length).toEqual(2)
      done()
    }).catch(function(err) { fail(err); done() })
  })
  it("can retrieve a party based on identity", function(done) {
    var abn = rest.uuid()
    partyHelper.new_party(abn).then(function (result) {
      partyHelper.get_party(abn).then(function (result) {
        expect(result.identities.length).toEqual(1)
        done()
      }).catch(function(err) { fail(err); done() })
    }).catch(function(err) { fail(err); done() })
  })
  it("can retrieve a list of identities for a party", function(done) {
    partyHelper.new_two_identity_party(rest.uuid()).then(function(result) {
      expect(result.identities.length).toEqual(2)
      done()
    }).catch(function(err) { fail(err); done() })
  })
  it("can change party roles", function(done) {
    partyHelper.update_party(rest.uuid(), {
        $addToSet: {roles: {name: "spouse"}},
        $set:      {"attributes.magic": "dark"}
      }
    ).then(function(partyDoc) {
      expect(partyDoc.roles.length).toEqual(2)
      done()
    }).catch(function(err) { fail(err); done() })
  })
  it("can change party attributes", function(done) {
    partyHelper.update_party(rest.uuid(), {
      "attributes.magic": "light"
    }).then(function(partyDoc) {
      expect(partyDoc.attributes.magic).toEqual("light")
      done()
    }).catch(function(err) { fail(err); done() })
  })
  it("can delete identities", function(done) {
    var abn_1 = rest.uuid()
    partyHelper.update_party(abn_1, {
      $pull: {identities: {value:abn_1, type:"abn"}},
    }).then(function (updatedParty) {
      expect(updatedParty.identities.length).toEqual(1)
      done()
    }).catch(function(err) { fail(err); done() })
  })
});