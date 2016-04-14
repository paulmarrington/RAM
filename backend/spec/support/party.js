rest = require("./rest.js")

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
      rest.put("party/identity/" + abn_1 + "/abn",
      
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
      rest.put("party/identity/" + abn + "/abn", updates)
      .then(function(updatedParty) {
          resolve(updatedParty)        
      }).catch(function(err) { reject(err) })
    }).catch(function(err) { reject(err) })
  })
}
module.exports = {
  get_party:              get_party,
  new_party:              new_party,
  new_two_identity_party: new_two_identity_party,
  update_party:           update_party
}