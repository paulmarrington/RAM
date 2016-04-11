var partyHelper = require("../../spec/support/party")
var rest = require("../../spec/support/rest.js")

describe("a RAM Relationship", () => {
  it("can be created", function(done) {
    new_relationships(1).then(rel => {
      expect(typeof rel._id).toBe("string")
      done()
    })
  })
  it("can retrieve a relationship by ID", function(done) {
    new_relationships(1).then(rel => {
      rest.get("Relationship/"+rel._id).then(function(res) {
        expect(rel._id).toEqual(res._id)
        done()
      })
    })
  })
  it("can list relationships", function(done) {
    new_relationships(12).then(rels => {
      var abn = rels[0].attributes.delegate_abn
      rest.get("Relationship/List/delegate/"+abn+
      "/abn/page/1/size/20")
      .then(function(res) {
        expect(res.length).toEqual(12)
        done()
      })
    })
  })
  it("can update a relationship", function(done) {
    new_relationships(1).then(rel => {
      var updates = { subjectRole: "bletherer" }
      rest.put("Relationship/"+rel._id, updates)
      .then(function(res) {
        expect(res.subjectRole).toEqual("bletherer")
        done()
      })
    })
  })
});

var new_relationships = function(count) {
  return new Promise(function(resolve, reject) {
  var abn_1 = rest.uuid(), abn_2 = rest.uuid()
  partyHelper.new_party(abn_1).then(function (party_1) {
  partyHelper.new_party(abn_2).then(function (party_2) {
    var list = []
    var add_relationship = function(counter) {
      var now = new Date()
      var tomorrow = new Date(now + 1000*60*60*12)
      var doc = {
        type:             "Business",
        subjectPartyId:   party_1._id,
        delegatePartyId:  party_2._id,
        startTimestamp:   now,
        endTimestamp:     tomorrow,
        status:           "Active",
        subjectNickName:  party_1.identities[0].name,
        delegateNickName: party_2.identities[0].name,
        attributes:       {delegate_abn: abn_2}
      }
      rest.post("Relationship", doc).then(function(res) {
        list.push(res)
      if (!counter) resolve(list.length == 1 ? list[0] : list)
      else          add_relationship(counter - 1)
      })
    }
    add_relationship(count - 1)
  })})})
}