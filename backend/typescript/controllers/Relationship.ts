/// <reference path="../_BackendTypes.ts" />

import * as express from "express";
import {model, IRelationship} from "../models/relationship"
import {IParty} from "../models/party"
import {getParty} from "./Party"
import * as mongoose from "mongoose"

export function RelationshipAPI() {
    const router: express.Router = express.Router();

    /* given id, retrieve relationship */
    router.get("/:id", (req, res) => {
      model.findById(req.params.id,
      function(err: any, relDoc: IRelationship) {
        if (err) {
          res.status(500).send(err.toString());
        } else {
          res.json(relDoc.toJSON())
        }
      })
    });

    /* list relationships for a specific delegate party */
    router.get(
    "/List/:delegate_or_subject/:_id/page/:page/size/:pagesize",
    (req, res) => {
      // Current mongo can get very slow for skip on large responses.
      // Let's hope this is fixed before release.
      const delegate_or_subject = req.params.delegate_or_subject
      var query: { [key: string] : any } = { deleted: false }
      query[delegate_or_subject + "PartyId"] =
      new mongoose.Types.ObjectId(req.params._id)
      model.find(query)
      // .skip((req.params.page - 1) * req.params.page_size)
      // .limit(req.params.page_size)
      // .lean()
      .find(function(err: any, relDocs: IRelationship[]) {
        if (!err) {
          res.json(relDocs)
        } else {
          res.status(500).send("Can't find party")
        }
      })
    });

    /*
     * Add a relationship.
     */
    router.post("/", (req, res) => {
      model.create(req.body,
      function(err: any, relDoc: IRelationship) {
        if (err) {
          res.status(500).send(err.toString())
        } else {
          res.json(relDoc.toJSON())
        }
      })
    });

    /* body must include updates - either fields that have
       changed or a mongo update command

       Only send back fields that have changed.
     */
    router.put("/:_id", (req, res) => {
      model.findByIdAndUpdate(req.params._id, req.body,
      {new: true}, function(err: any, relDoc: IRelationship) {
        if (err) {
          res.status(500).send(err.toString())
        } else {
          res.json(relDoc.toJSON())
        }
      })
    });

    return router;
}
