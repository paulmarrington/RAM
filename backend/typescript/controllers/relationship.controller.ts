import {sendDocument, sendNotFoundError, sendError} from './helpers';
import {Router} from 'express';
import {PartyModel} from '../models/party.model';
import {
  RelationshipModel, IRelationship, status_options, access_levels
} from '../models/relationship.model';
import * as mongoose from 'mongoose';
import {Response} from 'express';

// Todo: DelegateOrSubject to become Enum so it is then type checked
export const RelationshipAPI = () => {

  const router: Router = Router();

  type QueryRelationship = {
    deleted: boolean,
    subjectId?: mongoose.Types.ObjectId,
    delegateId?: mongoose.Types.ObjectId
  };

  function createQueryObject(delegateOrSubject: string, id: mongoose.Types.ObjectId): QueryRelationship {
    const isSubject = delegateOrSubject === 'subject';
    const query: QueryRelationship = { deleted: false };

    if (isSubject) {
      query.subjectId = id;
    } else {
      query.delegateId = id;
    }
    return query;
  }

  /* 
   * given id, retrieve relationship
   */
  router.get('/:id', (req, res) => {
    const id = new mongoose.Types.ObjectId(req.params.id);
    RelationshipModel.getRelationshipById(id).then(sendDocument(res), sendNotFoundError(res));
  });

  /* 
   * list relationships for a specific delegate party
   */
  router.get(
    '/list/:delegate_or_subject/:id/page/:page/size/:pagesize',
    (req, res) => {
      const query = createQueryObject(req.params.delegate_or_subject, req.params.id);
      console.log(query);
      RelationshipModel.find(query)
        .skip((req.params.page - 1) * req.params.page_size)
        .limit(req.params.page_size)
        .exec()
        .then(sendDocument(res));
    });

  /* 
   * Add a relationship.
   */
  router.post('/', (req, res) => {
    RelationshipModel.create(req.body).then(sendDocument(res), sendError(res));
  });

  /*
   * Body must include updates - either fields that have
   * changed or a mongo update command.
   * Only send back fields that have changed.
   */
  router.put('/:id', (req, res) => {
    RelationshipModel.findByIdAndUpdate(req.params.id, req.body,
      { new: true }).exec().then(sendDocument(res), sendError(res));
  });

  function sendRelationshipTable(res: Response, id: mongoose.Types.ObjectId, delegate_or_subject: string) {
    return async (relDocs: IRelationship[]) => {
      const rowCount = await getRowCount(delegate_or_subject, id);
      const types = await getDistinct(delegate_or_subject, id, 'type');
      sendDocument(res)({
        total: rowCount,
        table: mapRows(delegate_or_subject, relDocs),
        relationshipOptions: types,
        accessLevelOptions: access_levels,
        statusValueOptions: status_options
      });
    };
  }

  function mapRows(delegate_or_subject: string, relDocs: IRelationship[]) {
    return relDocs.map(relDoc => {
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
    });
  }

  function getRowCount(delegate_or_subject: string, id: mongoose.Types.ObjectId): mongoose.Promise<number> {
    return RelationshipModel.count(createQueryObject(delegate_or_subject, id)).exec();
  }

  function getDistinct(delegate_or_subject: string, id: mongoose.Types.ObjectId, field: string): mongoose.Promise<IRelationship[]> {
    return RelationshipModel.distinct(field, createQueryObject(delegate_or_subject, id)).exec();
  }

  router.get('/table/:delegate_or_subject/:value/:type/page/:page/size/:pagesize', (req, res) => {
    PartyModel.getPartyByIdentity(req.params.type, req.params.value).then((party) => {
      RelationshipModel.find(createQueryObject(req.params.delegate_or_subject, party._id))
        .skip((parseInt(req.params.page) - 1) * parseInt(req.params.pageSize))
        .limit(parseInt(req.params.pageSize)).exec()
        .then(sendRelationshipTable(res, party._id, req.params.delegate_or_subject), sendNotFoundError(res));
    }, sendNotFoundError(res));
  });
  return router;
};
