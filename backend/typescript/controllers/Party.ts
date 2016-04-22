/// <reference path="../_BackendTypes.ts" />

import * as express from "express"
import {model,Party} from "../models/party"
import * as mongoose from "mongoose"
import {IResponse, RAMMessageType, ErrorResponse} from "../../../commons/RamAPI"

function getPartyByIdentity
(identityType:string, identityValue:string,
actor: (doc? : Party) => any) : void {
  model.find({
    "identities.type":  identityType,
    "identities.value": identityValue,
    deleted:            false
  }).limit(1).lean().exec(function(err: any, pds: Party[]) {
    actor(err ? null : pds[0]);
  })
}

function getPartyById(id:string,
actor: (doc? : Party) => void) : void {
  model.find({ _id: id }).limit(1).lean().
  exec(function(err: any, pds: Party[]) {
    actor(err ? null : pds[0]);
  })
}

export function PartyAPI() {
  const router: express.Router = express.Router();

  /* given identity type and value, retrieve identity and party documents */
  router.get("/identity/:value/:type", (req, res) => {
    getPartyByIdentity(req.params.type, req.params.value,
    (partyDoc:Party) => {
      if (partyDoc) {
        var response:IResponse<Party> = {
          data:     partyDoc,
          status:   200
        }
        res.json(response);
      } else {
        sendError("Can't find party", res)
      }
    })
  });

  /*
   * Add a Party. It must have one identity to be valid.
   */
  router.post("/", (req, res) => {
    model.create(req.body, (err: any, pd: Party) => {
      if (err) {
        sendError(err.toString(), res)
      } else {
        // we have to ask for it again because typescript can't
        // work well with mongoose doc.toJSON() so we have to use
        // lean() instead.
        getPartyById(pd._id, (partyDoc) => {
          var response:IResponse<Party> = {
            data:     partyDoc,
            status:   200
          }
          res.json(response);
        })
      }
    })
  });

  /* We can change roles and other party attributes here */
  router.put("/identity/:value/:type", (req, res) => {
    model.findOneAndUpdate({
      "identities.type": req.params.type,
      "identities.value": req.params.value,
      deleted: false
    }, req.body, { new: true },
    function(err: any, pd:Party) {
      if (err) {
        sendError(err.toString(), res)
      } else {
        // we have to ask for it again because typescript can't
        // work well with mongoose doc.toJSON() so we have to use
        // lean() instead.
        getPartyById(pd._id, (partyDoc) => {
          var response:IResponse<Party> = {
            data:     partyDoc,
            status:   200
          }
          res.json(response);
        })
      }
    })
  });
  
  function sendError(msg:string, res:any) {
    res.json(new ErrorResponse(500, msg))
  }

  return router;
}
