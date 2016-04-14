/// <reference path="../_BackendTypes.ts" />

import * as express from "express";
import {model, IRelationship} from "../models/relationship"
import {IParty, IIdentity, model as partyModel} from "../models/party"
import {getParty} from "./Party"
import * as mongoose from "mongoose"
import {RelationshipTableRes, IRelationshipTableRow, IResponse, NavRes, IRelationshipQuickInfo} from "../../../commons/RamAPI"

export function RelationshipAPI() {
    const router: express.Router = express.Router();

    /* given id, retrieve relationship */
    router.get("/:id", (req, res) => {
      model.findById(req.params.id,
      function(err: any, relDoc: IRelationship) {
        if (err) {
          res.status(500).send(err.toString());
        } else {
          var response:IResponse<IRelationship> = {
            data:     relDoc.toJSON(),
            status:   200
          }
          res.json(response);
        }
      })
    });

    /* list relationships for a specific delegate party */
    router.get(
    "/list/:delegate_or_subject/:id/page/:page/size/:pagesize",
    (req, res) => {
      // Current mongo can get very slow for skip on large responses.
      // Let's hope this is fixed before release.
      const delegate_or_subject = req.params.delegate_or_subject
      var query: { [key: string] : any } = { deleted: false }
      query[delegate_or_subject + "Id"] =
      new mongoose.Types.ObjectId(req.params.id)
      model.find(query)
      .skip((req.params.page - 1) * req.params.page_size)
      .limit(req.params.page_size)
      .lean()
      .find(function(err: any, relDocs: IRelationship[]) {
        if (!err) {
          var response:IResponse<IRelationship[]> = {
            data:     relDocs,
            status:   200
          }
          res.json(response);
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
          var response:IResponse<IRelationship> = {
            data:     relDoc.toJSON(),
            status:   200
          }
          res.json(response);
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
          var response:IResponse<IRelationship> = {
            data:     relDoc.toJSON(),
            status:   200
          }
          res.json(response);
        }
      })
    });
    
    /* Provided navigation details for a relationship */
    router.get(
    "/table/:delegate_or_subject/:_id/page/:page/size/:pagesize",
    (req, res) => {
      // Current mongo can get very slow for skip on large responses.
      // Let's hope this is fixed before release.
      const delegate_or_subject = req.params.delegate_or_subject
      var query: { [key: string] : any } = { deleted: false }
      query[delegate_or_subject + "Id"] =
      new mongoose.Types.ObjectId(req.params._id)
      model.find(query)
      .skip((req.params.page - 1) * req.params.page_size)
      .limit(req.params.page_size)
      .lean()
      .find(function(err: any, relDocs: IRelationship[]) {
        if (!err) {
          var table:RelationshipTableRes = {
            total:                100,
            table:                relDocs.map(relDoc => {
              return {
                name: "tobedone",
                subName: relDoc[delegate_or_subject + "NickName"],
                relId: relDoc.delegateId,
                rel: relDoc.type,
                access: "bypassphrase",
                status: relDoc.status
              }
            }),
            relationshipOptions:  [],
            accessLevelOptions:   [],
            statusValueOptions:   []
          }
          var response:IResponse<RelationshipTableRes> = {
            data:     table,
            status:   200
          }
          res.json(response);
        } else {
          res.status(500).send("Can't find party")
        }
      })
    });
    
  function navFromIdentity(identityId:string,
  next:(IRelationshipQuickInfo) => void) {
      partyModel.findOne({
        "identities._id": new mongoose.Types.ObjectId(identityId)
      }, {"identities.$": 1}, (err: any, pd: IParty) => {
        var ident = pd.identities[0]
        next({
          id:       identityId,
          name:     ident.name,
          subName:  (ident.type === "abn") ? ident.value : ""
        })
      })
  }
  
  router.get("/path/*", (req, res) => {
    var navRes = new NavRes()
    var idList = req.params[0].split("/")
    var owner = idList[0]
    navFromIdentity(owner, (me:IRelationshipQuickInfo) => {
      navRes.partyChain = [me]
      var relIds = idList.slice(1)
      relIds.forEach((relId, idx) => {
        model.findById(relId, (err: any, relDoc: IRelationship) => {
          var nickname = relDoc.subjectsNickName.split("//")
          navRes.partyChain.push({
            id:       relId,
            name:     nickname[0],
            subName:  nickname[1]
          })
          if (idx === (relIds.length - 1)) {
            var response:IResponse<NavRes> = {
              data:     navRes,
              status:   200
            }
            res.json(response);
          }
        })
      })
    })
  })

  return router;
}
