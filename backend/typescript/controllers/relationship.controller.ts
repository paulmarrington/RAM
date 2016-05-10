import {sendDocument, sendNotFoundError, sendError, processRequest} from './helpers';
import {Router, Request, Response} from 'express';
import {
  IRelationship, statusOptions, accessLevels, IRelationshipModel
} from '../models/relationship.model';
import {
  IPartyModel
} from '../models/party.model';
import * as mongoose from 'mongoose';

// Todo: DelegateOrSubject to become Enum so it is then type checked

type QueryRelationship = {
  deleted: boolean,
  subjectId?: mongoose.Types.ObjectId,
  delegateId?: mongoose.Types.ObjectId
};

export class RelationshipController {
  constructor(private relationshipModel: IRelationshipModel,
    private partyModel: IPartyModel) { }
  private createQueryObject(delegateOrSubject: string, id: mongoose.Types.ObjectId): QueryRelationship {
    const isSubject = delegateOrSubject === 'subject';
    const query: QueryRelationship = { deleted: false };

    if (isSubject) {
      query.subjectId = id;
    } else {
      query.delegateId = id;
    }
    return query;
  }

  private getRowCount = (delegate_or_subject: string, id: mongoose.Types.ObjectId): mongoose.Promise<number> => {
    return this.relationshipModel.count(this.createQueryObject(delegate_or_subject, id)).exec();
  };

  private getDistinct = (delegate_or_subject: string, id: mongoose.Types.ObjectId, field: string): mongoose.Promise<IRelationship[]> => {
    return this.relationshipModel.distinct(field, this.createQueryObject(delegate_or_subject, id)).exec();
  };

  private mapRows(delegate_or_subject: string, relDocs: IRelationship[]) {
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

  /* 
   * given id, retrieve relationship
   */
  private getById = async (req: Request, res: Response) => {
    const id = new mongoose.Types.ObjectId(req.params.id);
    processRequest(res, () =>
      this.relationshipModel.getRelationshipById(id)
    );
  };

  /* 
   * list relationships for a specific delegate party
   */
  private getList = async (req: Request, res: Response) => {
    const query = this.createQueryObject(
      req.params.delegate_or_subject, req.params.id);
    processRequest(res, () =>
      this.relationshipModel.find(query)
        .skip((req.params.page - 1) * req.params.page_size)
        .limit(req.params.page_size)
        .exec()
    );
  };

  /**
   * Add a relationship.
   */
  private addRelationship = async (req: Request, res: Response) => {
    const newRelationship = new this.relationshipModel(req.body);
    processRequest(res, () =>
      this.relationshipModel.create(newRelationship)
    );
  };

  private getRelationshipTableAction = async (req: Request) => {

    const party = await this.partyModel.getPartyByIdentity(
      req.params.type, req.params.value
    );

    const start = (parseInt(req.params.page) - 1) *
      parseInt(req.params.pageSize);

    const relationships = await this.relationshipModel.find(
      this.createQueryObject(req.params.delegate_or_subject, party._id))
      .skip(start).limit(parseInt(req.params.pageSize)).exec()

    const rowCount = await this.getRowCount(
      req.params.delegate_or_subject, party._id);

    const types = await this.getDistinct(
      req.params.delegate_or_subject, party._id, 'type');

    const table = this.mapRows(
      req.params.delegate_or_subject, relationships);

    return {
      total: rowCount,
      table: table,
      relationshipOptions: types,
      accessLevelOptions: accessLevels,
      statusValueOptions: statusOptions
    };
  };

  private getRelationdhipTable = (req: Request, res: Response) => {
    processRequest(res, () => this.getRelationshipTableAction(req));
  };

  public assignRoutes = (router: Router) => {
    router.get('/list/:delegate_or_subject/:id/page/:page/size/:pagesize', this.getList);
    router.get('/table/:delegate_or_subject/:value/:type/page/:page/size/:pagesize', this.getRelationdhipTable);
    router.post('/', this.addRelationship);
    router.get('/:id', this.getById);
    return router;
  };
}
