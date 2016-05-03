var partyHelper = require("./party")
rest = require("./rest.js")
faker = require("faker")

var a_long_business_name =
  "A longish business name for the trust entity of another trusting bunch of people"
var a_short_business_name = faker.company.companyName()
var a_biz_who_gave_you_full_access = faker.company.companyName()
var a_biz_who_gave_you_limited_access = faker.company.companyName()
var b2b_business_that_has_trusts_in_mind = faker.company.companyName()+" Trustees"
var cloud_software_for_USI = faker.company.companyName() + " Clouds"

var parties = [{
  identities: [{
    name:   "Bob Bartholomew",
    type:   "pi",
    value:  "bob"
  }],
  i_can_act_for:  [{
    name:         a_short_business_name,
    relationship: "Associate",
    access_level: "Universal",
    status:       "Active"
  },{
    name:         a_long_business_name,
    relationship: "User",
    access_level: "Limited",
    status:       "Active"
  },{
    name:         "Barbara Bartholomew",
    relationship: "Family",
    access_level: "Legal attorney",
    nick_name:    "Barb",
    status:       "Active"
  }],
  can_act_for_me: [{
    name:         "Susan Bartholomew",
    relationship: "Spouse",
    access_level: "Universal",
    nick_name:    "Suzy",
    status:       "Active"
  }]
},{
  identities: [{
    name:   "Barbara Bartholomew",
    type:   "pi",
    value:  "barbara"
  }],
  i_can_act_for:  [],
  can_act_for_me: []
},{
  identities: [{
    name:   "Susan Bartholomew",
    type:   "pi",
    value:  "susan"
  }],
  i_can_act_for:  [],
  can_act_for_me: []
},{
  identities: [{
    name:   a_short_business_name,
    type:   "abn",
    value:  "51515151151"
  }],
  i_can_act_for:  [],
  can_act_for_me: []
},{
  identities: [{
    name:   a_long_business_name,
    type:   "abn",
    value:  "61616161161"
  }],
  i_can_act_for:  [{
    name:         a_biz_who_gave_you_full_access,
    relationship: "Business you can act for",
    access_level: "Universal",
    status:       "Active"
  },{
    name:         a_biz_who_gave_you_limited_access,
    relationship: "Trust to trustee",
    access_level: "Limited",
    status:       "Active"
  }],
  can_act_for_me: [{
    name:         "Alex Minimus",
    relationship: "User",
    access_level: "Universal",
    status:       "Active"
  },{
    name:         b2b_business_that_has_trusts_in_mind,
    relationship: "Business acts for you",
    access_level: "Limited",
    status:       "Active"
  },{
    name:         cloud_software_for_USI,
    relationship: "Hosted software provider",
    access_level: "Fixed",
    status:       "Active"
  },{
    name:         "Henry Puffandstuff",
    relationship: "User",
    access_level: "Limited",
    status:       "Active"
  },{
    name:         "Horatio Elvistar",
    relationship: "User",
    access_level: "Limited",
    status:       "Active"
  }]
},{
  identities: [{
    name:   a_biz_who_gave_you_full_access,
    type:   "abn",
    value:  "21215251251"
  }],
  i_can_act_for:  [],
  can_act_for_me: []
},{
  identities: [{
    name:   a_biz_who_gave_you_limited_access,
    type:   "abn",
    value:  "68686868868"
  }],
  i_can_act_for:  [],
  can_act_for_me: []
},{
  identities: [{
    name:   "Alex Minimus",
    type:   "pi",
    value:  "alex"
  }],
  i_can_act_for:  [],
  can_act_for_me: []
},{
  identities: [{
    name:   b2b_business_that_has_trusts_in_mind,
    type:   "abn",
    value:  "68686868868"
  }],
  i_can_act_for:  [],
  can_act_for_me: []
},{
  identities: [{
    name:   cloud_software_for_USI,
    type:   "abn",
    value:  "22222222222"
  }],
  i_can_act_for:  [],
  can_act_for_me: []
},{
  identities: [{
    name:   "Henry Puffandstuff",
    type:   "pi",
    value:  "henry"
  }],
  i_can_act_for:  [],
  can_act_for_me: []
},{
  identities: [{
    name:   "Horatio Elvistar",
    type:   "pi",
    value:  "horatio"
  }],
  i_can_act_for:  [],
  can_act_for_me: []
}]

function add_roles(party) {
  return party.roles || []
}

function add_attributes(party) {
  return party.attributes || {}
}

function add_identities(party) {
  return party.identities.map(function(identity) {
    return identity
  })
}

var db_parties = {}

function add_relationship(rel, my_party, subdel) {
    var now = new Date()
    var next_year = new Date(now + 1000*60*60*12*365)
    var doc = {
      type:               rel.relationship || "Universal",
      startTimestamp:     now,
      endTimestamp:       next_year,
      status:             rel.status || "Active"
    }
    var my_db_party =     db_parties[my_party.identities[0].name]
    var their_db_party =  db_parties[rel.name]
    if (!their_db_party) {
      console.log("No target party for ",rel.name, "from", my_party.identities[0].name)
      return;
    }
    var me = (subdel === "subject") ? "delegate" : "subject"
    doc[me+"Id"] = my_db_party._id
    doc[subdel+"Id"] = their_db_party.identities[0]._id
    if (their_db_party.identities[0].type === "abn") {
      doc[subdel+"Abn"] = their_db_party.identities[0].value
    }
    if (my_db_party.identities[0].type === "abn") {
      doc[me+"Abn"] = my_db_party.identities[0].value
    }
    doc[subdel+"Name"] = rel.name
    doc[me+"Name"] = my_db_party.identities[0].name
    doc[subdel+"Role"] = rel.relationship
    if (my_db_party.roles.length > 0) doc[me+"Role"] = my_db_party.roles[0]
    if (rel.nick_name) doc[subdel+"NickName"] = rel.nick_name
    rest.post("relationship", doc)
}

describe("Seeding Test RAM Database...", () => {
  it("...done", function(done) {
    parties.forEach((party) => {
      rest.post("Party", {
        roles:      add_roles(party),
        attributes: add_attributes(party),
        identities: add_identities(party)
      }).then(function(res) {
        db_parties[party.identities[0].name] = res
      })
    })
    // wait for parties to be written - too lazy to use promises here
    setTimeout( function() {
      parties.forEach((party) => {
        party.i_can_act_for.forEach(function (rel) {
          add_relationship(rel, party, "delegate")
        })
        party.can_act_for_me.forEach(function (rel) {
          add_relationship(rel, party, "subject")
        })
      })
      setTimeout(done, 4000)
    }, 4000)
  }, 10000)
})