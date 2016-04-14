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
    
    function getTableRows(delegate_or_subject:string, id:string,
    page:number, pageSize:number,
    cb:(err:any,row?:IRelationshipTableRow[]) => void) {
      // Current mongo can get very slow for skip on large responses.
      // Let's hope this is fixed before release.
      var query: { [key: string] : any } = { deleted: false }
      query[delegate_or_subject + "Id"] =
      new mongoose.Types.ObjectId(id)
      model.find(query)
      .skip((page - 1) * pageSize)
      .limit(+pageSize)
      .lean()
      .find(function(err: any, relDocs:IRelationship[]) {
        if (!err) {
          cb (null, relDocs.map(relDoc => {
            return {
              name: "tobedone",
              subName: relDoc[delegate_or_subject + "NickName"],
              relId: relDoc.delegateId,
              rel: relDoc.type,
              access: "bypassphrase",
              status: relDoc.status
            }
          }))
        } else {
          cb(err)
        }
      })
    }
    function getRowCount(delegate_or_subject, id, cb) {
      var query: { [key: string] : any } = { deleted: false }
      query[delegate_or_subject + "Id"] =
      new mongoose.Types.ObjectId(id)
      model.count(query, cb)
    }
    
    function getDistinct(delegate_or_subject, id, field, cb) {
      var query: { [key: string] : any } = { deleted: false }
      query[delegate_or_subject + "Id"] =
      new mongoose.Types.ObjectId(id)
      model.distinct(field, query, cb)
    }
    
    /* Provided navigation details for a relationship */
    router.get(
    "/table/:delegate_or_subject/:_id/page/:page/size/:pagesize",
    (req, res) => {
      getTableRows(req.params.delegate_or_subject, req.params._id,
      req.params.page, req.params.pagesize, (err, rows) => {
      getRowCount(req.params.delegate_or_subject, req.params._id,
      (err, total) => {
      getDistinct(req.params.delegate_or_subject, req.params._id,
      "type", (err, types) => {
      getDistinct(req.params.delegate_or_subject, req.params._id,
      "subjectRole", (err, statuses) => {
      getDistinct(req.params.delegate_or_subject, req.params._id,
      "status", (err, roles) => {
        var table:RelationshipTableRes = {
          total:                total,
          table:                rows,
          relationshipOptions:  types,
          accessLevelOptions:   roles,
          statusValueOptions:   statuses
        }
        var response:IResponse<RelationshipTableRes> = {
          data:     table,
          status:   200
        }
        res.json(response);
      })})})})})
    });
    
  function navFromIdentity(identityId:string,
  next:(rq:IRelationshipQuickInfo) => void) {
    if (identityId === "*") {
      var query = {}
      var opts = {}
    } else {
      var query = {
      "identities._id": new mongoose.Types.ObjectId(identityId)
      }
      var opts = {"identities.$": 1}
    }
    partyModel.findOne(query, opts, (err: any, pd: IParty) => {
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
      if (relIds.length) {
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
      } else {
        var response:IResponse<NavRes> = {
          data:     navRes,
          status:   200
        }
        res.json(response);
      }
    })
  })

  return router;
}
