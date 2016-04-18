/// <reference path="../_BackendTypes.ts" />

import * as express from "express";
import {model, IRelationship} from "../models/relationship"
import {IParty, IIdentity, model as partyModel} from "../models/party"
import * as mongoose from "mongoose"
import {
  IRelationshipTableRes, IRelationshipTableRow,
  IResponse, NavRes, IRelationshipQuickInfo
} from "../../../commons/RamAPI"

function getRelationshipById(id:string,
actor: (doc? : IRelationship) => void): void {
  model.find({_id:id}).limit(1).lean()
  .exec(function(err: any, relDocs: IRelationship[]) {
    actor(relDocs[0])
  })
}

export function RelationshipAPI() {
  const router: express.Router = express.Router();
  
  router.get("/path", (req, res) => {
    var navRes = new NavRes()
    getRandomParty((pd:IParty) => {
      var ownerId = pd.identities[0]._id
      sendQuickInfo(ownerId, [], res)
    })
  })

  /* given id, retrieve relationship */
  router.get("/:id", (req, res) => {
    getRelationshipById(req.params.id, (rd) => {
      if (rd) {
        var response:IResponse<IRelationship> = {
          data:     rd,
          status:   200
        }
        res.json(response);
      } else {
        res.status(500).send("can't retrieve relationship");
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
        getRelationshipById(relDoc._id, (rd) => {
          var response:IResponse<IRelationship> = {
            data:     rd,
            status:   200
          }
          res.json(response);
        })
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
        getRelationshipById(relDoc._id, (rd) => {
          var response:IResponse<IRelationship> = {
            data:     rd,
            status:   200
          }
          res.json(response);
        })
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
          if (delegate_or_subject === "subject") {
            var name = relDoc.subjectsNickName || relDoc.subjectName
            var subName = relDoc.subjectsAbn
            var access = relDoc.subjectRole
            var relId = relDoc.subjectId
          } else {
            var name = relDoc.delegatesNickName || relDoc.delegateName
            var subName = relDoc.delegateAbn
           var subName = relDoc.delegatesNickName
           var access = relDoc.delegateRole
           var relId = relDoc.delegateId
          }
          return {
            name: name,
            subName: subName,
            relId: relDoc.delegateId,
            rel: relDoc.type,
            access: access,
            status: relDoc.status
          }
        }))
      } else {
        cb(err)
      }
    })
  }
  function getRowCount(delegate_or_subject:string, id:string,
  cb: (err:any, count:number) => void) {
    var query: { [key: string] : any } = { deleted: false }
    query[delegate_or_subject + "Id"] =
    new mongoose.Types.ObjectId(id)
    model.count(query, cb)
  }
  
  function getDistinct(delegate_or_subject:string, id:string,
  field:string, cb: (err:any, distinct_entries: any[]) => void) {
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
      var table:IRelationshipTableRes = {
        total:                total,
        table:                rows,
        relationshipOptions:  types,
        accessLevelOptions:   roles,
        statusValueOptions:   statuses
      }
      var response:IResponse<IRelationshipTableRes> = {
        data:     table,
        status:   200
      }
      res.json(response);
    })})})})})
  });
  
  function quickInfoFromParty(partyDoc: IParty):IRelationshipQuickInfo {
    var ident:IIdentity = partyDoc.identities[0]
    return({
      id:       ident._id,
      name:     ident.name,
      subName:  (ident.type === "abn") ? ident.value : ""
    })
  }
  
  function getRandomParty(next:(partyDoc:IParty) => void):void {
    partyModel.aggregate({ $sample: { size: 1 } },
    (err:any, partyDocs:IParty[]) => {
      next(partyDocs[0])
    })
  }
    
  function navFromIdentity(identityId:string,
  next:(rq:IRelationshipQuickInfo) => void) {
    var query = {
      "identities._id": new mongoose.Types.ObjectId(identityId)
    }
    var opts = {"identities.$": 1}
    partyModel.findOne(query, opts, (err: any, pd: IParty) => {
      next(quickInfoFromParty(pd))
    })
  }
  
  function getQuickInfo(owner:IRelationshipQuickInfo,
  relIds:string[], next:(err:any, navRes:NavRes)=>void) {
    var navRes = new NavRes()
    navRes.partyChain = [owner]
    if (relIds.length && relIds[0].length) {
      relIds.forEach((relId, idx) => {
        model.findById(relId, (err: any, relDoc: IRelationship) => {
          var nickname = relDoc.subjectsNickName.split("//")
          navRes.partyChain.push({
            id:       relId,
            name:     nickname[0],
            subName:  nickname[1]
          })
          if (idx + 1 == relIds.length) next(null, navRes)
        })
      })
    } else {
      next(null, navRes)
    }
  }
  
  function sendResponse(navRes:NavRes, res:any) {
    var response:IResponse<NavRes> = {
      data:     navRes,
      status:   200
    }
    res.json(response);
  }
  
  function sendQuickInfo(ownerId:string, relIds:string[], res:any) {
    navFromIdentity(ownerId, (owner:IRelationshipQuickInfo) => {
    getQuickInfo(owner, relIds, (err:any, navRes:NavRes)=> {
      sendResponse(navRes, res)
    })})
  }
  
  router.get("/path/*", (req, res) => {
    var navRes = new NavRes()
    var idList = req.params[0].split("/")
    var ownerId = idList[0]
    var relIds = idList.slice(1)
    sendQuickInfo(ownerId, relIds, res)
  })

  return router;
}
