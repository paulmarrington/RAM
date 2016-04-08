/// <reference path="../_BackendTypes.ts" />

import * as express from "express";
import * as relationship from "../models/relationship"
import {IParty} from "../models/party"
import {getParty} from "./Party"

function getRelationship(req:any, res:any, actor:any) {
  relationship.model.findById(req.params.id,
  function(err: any, relDoc: any) {
    if (err) return actor(null, res.status(500).send(err.toString()))
    else return actor(relDoc)
  })
}

export function RelationshipAPI() {
    const router: express.Router = express.Router();

    /* given id, retrieve relationship */
    router.get("/:id", (req, res) => {
      getRelationship(req, res, function(relDoc:any, resp:any){
      if (relDoc) res.json(relDoc.toJSON())
      })
    });
    
    /* list relationships for a specific delegate party */
    router.get("/List/:Delegate_or_Party/:value/:type/page/:page/size/:pagesize",
    (req, res) => {
      const party = getParty(req, res, function(party:IParty) {
        if (party) {
          // Current mongo can get very slow for skip on large responses.
          // Let's hope this is fixed before release.
          const delegate_or_party = req.params.Delegate_or_Party
          var query: { [key: string] : any } = { deleted: false }
          query[delegate_or_party + "PartyId"] = party._id
          relationship.model.find(query)
          .skip((req.params.page - 1) * req.params.page_size)
          .limit(req.params.page_size)
          .lean()
          .find(function(err: any, relDocs: any[]) {
            if (!err) res.json(JSON.stringify(relDocs))
          })
        } else {
          res.status(500).send("Can't find party")
        }
      })
    });
    
    /*
     * Add a relationship.
     */
    router.post("/", (req, res) => {
      relationship.model.create(req.body, function(err: any, relDoc: any) {
        if (err) return res.status(500).send(err.toString())
        return res.json(relDoc.toJSON())
      })
    });
    
    /* body must include
         _id:     id of relationship record
         updates: either fields that have changed or a mongo update command
         
       Only send back fields that have changed.
     */
    router.put("/", (req, res) => {
      relationship.model.findByIdAndUpdate(req.body._id, req.body.updates,
      {new: true}, function(err: any, relDoc: any) {
        if (err) return res.status(500).send(err.toString())
        return res.json(relDoc.toJSON())
      })
    });
    
    return router;
}
