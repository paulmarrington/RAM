/// <reference path="../_BackendTypes.ts" />
import * as dto from "../../../commons/RamDTO";
import * as mongo from "../mongo"

/* We retrieve a party based on an identity document */
export function read(name:string) {
  return new Promise(function(resolve, reject) {
    mongo.findOne("agencies",
    { {$or [{currentName: name},{currentAbbrieviation: name}]},
    deleted: false })
    .then(function(agency) { resolve(agency) })
    .catch(function(err) {
      mongo.findOne("agencies",
      { {$or [{previousNames: name},{previousAbbrieviations: name}]},
      deleted: false })
      .then(function(agency) { resolve(agency) })
      .catch(function(err) {
        reject(err)
      })
    })
  })
}

/* To create a new party we need to create party and identity documents */
export function add(agency: dto.Agency) {
  return mongo.insertOne("agencies", agency)
}

/* Updating parties means updating roles, or general attributes */
export function update(_id: string, updates) {
  return mongo.updateOne("agencies", _id, updates)
}

/* deleting parties is a matter of marking them with a deleted flag */
export function remove(_id: string) {
  return mongo.updateOne("agencies", _id, { deleted: true })
}

/*
 * add indexes if they are not already created...
 * (none for parties as they are always referenced through identities)
 */
var identities_collection = mongo.db.collection("agencies")
identities_collection.createIndex({ currentName: 1, deleted: 1 })
identities_collection.createIndex({ currentAbbrieviation: 1, deleted: 1 })
identities_collection.createIndex({ previousNames: 1, deleted: 1 })
identities_collection.createIndex({ previousAbbrieviations: 1, deleted: 1 })
