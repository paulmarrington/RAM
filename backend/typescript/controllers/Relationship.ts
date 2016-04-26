/// <reference path='../_BackendTypes.ts' />

import {Router, Response} from 'express';
import {
  model, Relationship, status_options, access_levels
} from '../models/relationship';
import * as mongoose from 'mongoose';
import {
  IRelationshipTableRes, IRelationshipTableRow,
  IResponse, ErrorResponse
} from '../../../commons/RamAPI';

const getRelationshipById = (id:string,
actor: (doc? : Relationship) => void): void => {
  model.find({_id:id}).limit(1).lean()
  .exec((err: string, relDocs: Relationship[]) => {
    actor(relDocs[0]);
  });
};

const sendError = (msg:string, res:Response) => {
  res.json(new ErrorResponse(500, msg));
};

export const RelationshipAPI = () => {
  const router: Router = Router();

  /* given id, retrieve relationship */
  router.get('/:id', (req, res) => {
    getRelationshipById(req.params.id, (rd) => {
      if (rd) {
        const response:IResponse<Relationship> = {
          data:     rd,
          status:   200
        };
        res.json(response);
      } else {
        sendError('can\'t retrieve relationship', res);
      }
    });
  });

  /* list relationships for a specific delegate party */
  router.get(
  '/list/:delegate_or_subject/:id/page/:page/size/:pagesize',
  (req, res) => {
    // Current mongo can get very slow for skip on large responses.
    // Let's hope this is fixed before release.
    const delegate_or_subject = req.params.delegate_or_subject;
    const query: { [key: string] : any } = { deleted: false };
    query[delegate_or_subject + 'Id'] =
    new mongoose.Types.ObjectId(req.params.id);
    model.find(query)
    .skip((req.params.page - 1) * req.params.page_size)
    .limit(req.params.page_size)
    .lean()
    .find((err: string, relDocs: Relationship[]) => {
      if (!err) {
        const response:IResponse<Relationship[]> = {
          data:     relDocs,
          status:   200
        };
        res.json(response);
      } else {
        sendError('Listing failed', res);
      }
    });
  });

  /*
    * Add a relationship.
    */
  router.post('/', (req, res) => {
    model.create(req.body,
    (err: string, relDoc: Relationship) => {
      if (err) {
        console.log(err);
        sendError('Relationship addition failed', res);
      } else {
        getRelationshipById(relDoc._id, (rd) => {
          const response:IResponse<Relationship> = {
            data:     rd,
            status:   200
          };
          res.json(response);
        });
      }
    });
  });

  /* body must include updates - either fields that have
      changed or a mongo update command

      Only send back fields that have changed.
    */
  router.put('/:_id', (req, res) => {
    model.findByIdAndUpdate(req.params._id, req.body,
    {new: true}, (err: string, relDoc: Relationship) => {
      if (err) {
        console.log(err);
        sendError('Relationship update failed', res);
      } else {
        getRelationshipById(relDoc._id, (rd) => {
          const response:IResponse<Relationship> = {
            data:     rd,
            status:   200
          };
          res.json(response);
        });
      }
    });
  });

  function getTableRows(delegate_or_subject:string, id:string,
  page:number, pageSize:number,
  cb:(err:string,row?:IRelationshipTableRow[]) => void) {
    // Current mongo can get very slow for skip on large responses.
    // Let's hope this is fixed before release.
    const query: { [key: string] : any } = { deleted: false };
    query[delegate_or_subject + 'Id'] =
    new mongoose.Types.ObjectId(id);
    model.find(query)
    .skip((page - 1) * pageSize)
    .limit(+pageSize)
    .lean()
    .find((err: string, relDocs:Relationship[]) => {
      if (!err) {
        cb (null, relDocs.map(relDoc => {
          if (delegate_or_subject === 'delegate') {
            return {
              name: relDoc.subjectsNickName || relDoc.subjectName,
              subName: relDoc.subjectAbn,
              relId: relDoc.subjectId,
              rel: relDoc.type,
              access: relDoc.subjectRole,
              status: relDoc.status
            };
          } else {
            return {
              name: relDoc.delegatesNickName || relDoc.delegateName,
              subName: relDoc.delegateAbn,
              relId: relDoc.delegateId,
              rel: relDoc.type,
              access: relDoc.delegateRole,
              status: relDoc.status
            };
          }
        }));
      } else {
        console.log(err);
        cb(err);
      }
    });
  }
  function getRowCount(delegate_or_subject:string, id:string,
  cb: (err:string, count:number) => void) {
    const query: { [key: string] : any } = { deleted: false };
    query[delegate_or_subject + 'Id'] = new mongoose.Types.ObjectId(id);
    model.count(query, cb);
  }

  function getDistinct(delegate_or_subject:string, id:string,
  field:string, cb: (err:string, distinct_entries: any[]) => void) {
    const query: { [key: string] : any } = { deleted: false };
    query[delegate_or_subject + 'Id'] = new mongoose.Types.ObjectId(id);
    model.distinct(field, query, cb);
  }

  router.get(
  '/table/:delegate_or_subject/:_id/page/:page/size/:pagesize',
  (req, res) => {
    getTableRows(req.params.delegate_or_subject, req.params._id,
    req.params.page, req.params.pagesize, (err, rows) => {
    getRowCount(req.params.delegate_or_subject, req.params._id,
    (err, total) => {
    getDistinct(req.params.delegate_or_subject, req.params._id,
    'type', (err, types) => {
      const table = {
        total:                total,
        table:                rows,
        relationshipOptions:  types,
        accessLevelOptions:   access_levels,
        statusValueOptions:   status_options
      };
      const response:IResponse<IRelationshipTableRes> = {
        data:     table,
        status:   200
      };
      res.json(response);
    });});});
  });

  return router;
};
