var partyHelper = require("../../spec/support/party")
var rest = require("../../spec/support/rest.js")
faker = require("faker")

describe("a RAM Relationship", () => {
  it("can be created", function (done) {
    new_relationships(1).then(rel => {
      expect(typeof rel._id).toBe("string")
      done()
    })
  })
  it("can retrieve a relationship by ID", function (done) {
    new_relationships(1).then(rel => {
      rest.get("relationship/" + rel._id).then(function (res) {
        expect(rel._id).toEqual(res._id)
        done()
      })
    })
  })
  it("can list relationships", function (done) {
    new_relationships(12).then(rels => {
      rest.get("relationship/list/delegate/" +
        rels[0].delegateId + "/page/1/size/20")
        .then(function (res) {
          expect(res.length).toEqual(12)
          done()
        })
    })
  })
  it("can update a relationship", function (done) {
    new_relationships(1).then(rel => {
      var updates = { subjectRole: "bletherer" }
      rest.put("relationship/" + rel._id, updates)
        .then(function (res) {
          expect(res.subjectRole).toEqual("bletherer")
          done()
        })
    })
  })
  // it("can load tables required by UI", function (done) {
  //   new_relationships(12).then(rels => {
  //     console.log(rels[0]);
  //     var url = "relationship/table/delegate/" +
  //       rels[0].delegateIdentityValue + "/" + rels[0].delegateIdentityType + "/page/1/size/20";
  //     console.log(url);
  //     rest.get(url)
  //       .then(function (res) {
  //         expect(res.table.length).toEqual(12)
  //         done()
  //       })
  //   })
  // })
});

function random_relationship_type() {
  return faker.random.arrayElement["Business", "Online Service Provider"]
}

var new_relationships = function (count) {
  return new Promise(function (resolve, reject) {
    var abn_1 = partyHelper.fake_abn(), abn_2 = partyHelper.fake_abn()
    partyHelper.new_party(abn_1).then(function (party_1) {
      partyHelper.new_party(abn_2).then(function (party_2) {
        var list = []
        var add_relationship = function (counter) {
          var now = new Date()
          var tomorrow = new Date(now + 1000 * 60 * 60 * 12)
          var doc = {
            type: random_relationship_type,
            subjectId: party_1.identities[0]._id,
            subjectName: party_1.identities[0].name,
            subjectAbn: abn_1,
            subjectRole: faker.name.jobArea(),
            delegateId: party_2.identities[0]._id,
            delegateName: party_2.identities[0].name,
            delegateAbn: abn_2,
            delegateRole: faker.name.jobArea(),
            startTimestamp: now,
            endTimestamp: tomorrow,
            status: "Active",
            subjectsNickName: faker.name.firstName(),
            delegatesNickName: faker.name.firstName(),
            attributes: { delegate_abn: abn_2 }
          }
          rest.post("relationship", doc).then(function (res) {
            list.push(res)
            if (!counter) resolve(list.length == 1 ? list[0] : list)
            else add_relationship(counter - 1)
          })
        }
        add_relationship(count - 1)
      })
    })
  })
}