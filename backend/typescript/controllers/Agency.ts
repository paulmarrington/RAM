/// <reference path="../_BackendTypes.ts" />

import * as express from "express";
import * as ramDTO from "../../../commons/RamDTO";
import * as party from "../models/party"
import * as agency from "../models/agency"

export function PartyAPI() {
    const router: express.Router = express.Router();

    /* Retrieve an agency based on name or abbreviation, new or old */
    router.get("/", async(req, res, next) => {
      agency.read(req.query.name)
      .then(function(agencyDoc) { res.json(agencyDoc) })
      .catch(function(err) { res.status(500).send(err.toString()) })
    });
    
    /*
     * Add an identity and optional new party record. Body can
     * contain either an Identity record or one containing
     * Identity and Party records.
     */
    router.post("/", async(req, res, next) => {
      var data = req.body;
      var addIdentity = function(identity) {
        party.addIdentity(identity).then(function() {
          res.json({error: false, partyId: identity.partyId})
        }).catch(function(err) { res.status(500).send(err.toString()) })
      }
      if (data.party) {
        party.add(data.party).then(function() {
          if (data.identity) {
            data.identity.partyId = data.party._id
            addIdentity(data.identity)
          } else {
            res.json({error: false, partyId: data.party._id})
          }
        }).catch(function(err) { res.status(500).send(err.toString()) })
      } else if (data.partyId) {
        addIdentity(data)
      } else {
        res.status(500).send("Identity not loaded")
      }
    });
    
    /* We can change roles and other party attributes here */
    router.put("/", async(req, res, next) => {
      party.update(req.query._id, req.body).
      then(function(data) { res.json({error: false}) }).
      catch(function(err) { res.status(500).send(err.toString()) })
    });
    
    /* we can mark an identity as deleted */
    router.delete("/", async(req, res, next) => {
      party.deleteIdentity(req.query._id).
      then(function(data) { res.json(data) }).
      catch(function(err) { res.status(500).send(err.toString()) })
    });
    
    return router;
}
