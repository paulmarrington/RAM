/// <reference path="../_BackendTypes.ts" />
import * as dto from "../../../commons/RamDTO";
import * as mongo from "../mongo"

/* We retrieve a party based on an identity document */
export function read(type:string, value: string) {
  return new Promise(function(resolve, reject) {
    var identity = mongo.findOne("identities", { type: type, value: value })
    identity.then(function(identity) {
      var party = mongo.read("parties", identity.partyId)
      party.then(function(party) {
        resolve(party)
      }).catch(function(err) { reject(err) })
    }).catch(function(err) { reject(err) })
  })
}

/* retrieve a list of identities for a party */
export function identities(_id: string) {
  return mongo.findAll("identities", { partyId: mongo.ObjectID(_id) }).toArray()
}

/* add a new identity to an existing party */
export function addIdentity(identity: dto.Identity) {
  identity.partyId = mongo.ObjectID(identity.partyId)
  return mongo.insertOne("identities", identity)
}

/* To create a new party we need to create party and identity documents */
export function add(party: dto.Party) {
  return mongo.insertOne("parties", party)
}

/* Updating parties means updating roles, or general attributes */
export function update(_id: string, updates) {
  return mongo.updateOne("parties", _id, updates)
}

/* deleting parties is a matter of marking them with a deleted flag */
export function deleteParty(_id: string) {
  return mongo.updateOne("parties", _id, { deleted: true })
}

/* we can't update identities, just delete and add new */
export function deleteIdentity(_id: string) {
  return mongo.updateOne("identities", _id, { deleted: true })
}

/*
 * add indexes if they are not already created...
 * (none for parties as they are always referenced through identities)
 */
mongo.db.collection("identities").createIndex({ type: 1, value: 1 })