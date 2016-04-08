/// <reference path="../_BackendTypes.ts" />

import * as express from "express";
import {model,IParty} from "../models/party"
import * as mongoose from "mongoose"

export function getParty
(req:express.Request, res:express.Response,
actor: (doc? : IParty) => any) : void {
  model.findOne({
    "identities.type": req.params.type,
    "identities.value": req.params.value,
    deleted: false
  }, function(err: any, partyDoc: any) {
    actor(err ? null : partyDoc);
  })
}

export function PartyAPI() {
  const router: express.Router = express.Router();

  /* given identity type and value, retrieve identity and party documents */
  router.get("/Identity/:value/:type", (req, res) => {
    getParty(req, res, function(partyDoc:IParty) {
    if (partyDoc) {
      res.json(partyDoc.toJSON())
    } else {
      res.status(500).send("Can't find party")
    }
    })
  });

  /*
   * Add a Party. It must have one identity to be valid.
   */
  router.post("/", (req, res) => {
    model.create(req.body,
    function(err: any, partyDoc: IParty) {
      if (err) {
        res.status(500).send(err.toString());
      } else {
        res.json(partyDoc.toJSON());
      }
    })
  });

  /* We can change roles and other party attributes here */
  router.put("/Identity/:value/:type", (req, res) => {
    model.findOneAndUpdate({
      "identities.type": req.params.type,
      "identities.value": req.params.value,
      deleted: false
    }, req.body, { new: true },
    function(err: any, partyDoc:IParty) {
      if (err) {
        res.status(500).send(err.toString());
      } else {
        res.json(partyDoc.toJSON());
      }
    })
  });

  return router;
}
