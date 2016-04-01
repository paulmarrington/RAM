/// <reference path="../_BackendTypes.ts" />

import * as express from "express";
import * as party from "../models/party"

export function PartyAPI() {
    const router: express.Router = express.Router();

    /* given identity type and value, retrieve identity and party documents */
    router.get("/Identity/:value/:type", async(req, res) => {
      party.model.findOne({
        "identities.type":  req.params.type,
        "identities.value": req.params.value,
        deleted:            false
      }, function(err: any, partyDoc: any) {
        if (err) return res.status(500).send(err.toString())
        res.json(partyDoc.toJSON())
      })
    });
    
    /*
     * Add a Party. It must have one identity to be valid.
     */
    router.post("/", (req, res) => {
      party.model.create(req.body, function(err: any, partyDoc: any) {
        if (err) return res.status(500).send(err.toString())
        return res.json(partyDoc.toJSON())
      })
    });
    
    /* We can change roles and other party attributes here */
    router.put("/Identity/:value/:type", (req, res) => {
      party.model.findOneAndUpdate({
        "identities.type":  req.params.type,
        "identities.value": req.params.value,
        deleted:            false
      }, req.body, { new: true }, function(err: any, partyDoc: any) {
        if (err) return res.status(500).send(err.toString())
        res.json(partyDoc.toJSON())
      })
    });
    
    return router;
}
