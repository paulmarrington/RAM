import {sendDocument, sendError, sendNotFoundError, validateReqSchema} from './helpers';
import {Router, Request, Response} from 'express';
import {IRelationshipTypeModel } from '../models/relationshipType.model';

export class RelationshipTypeController {

    constructor(private relationshipTypeModel: IRelationshipTypeModel) {
    }

    private findByCodeInDateRange = async (req: Request, res: Response) => {
        const schema = {
            'code': {
                notEmpty: true,
                errorMessage: 'Code is not valid'
            }
        };
        validateReqSchema(req, schema)
            .then((req:Request) => this.relationshipTypeModel.findByCodeInDateRange(req.params.code))
            .then(sendDocument(res), sendError(res))
            .then(sendNotFoundError(res));
    };

    private listInDateRange = async (req: Request, res: Response) => {
        const schema = {};
        validateReqSchema(req, schema)
            .then((req:Request) => this.relationshipTypeModel.listInDateRange())
            .then(sendDocument(res), sendError(res))
            .then(sendNotFoundError(res));
    };

    public assignRoutes = (router: Router) => {
        router.get('/v1/relationshipType/:code', this.findByCodeInDateRange);
        router.get('/v1/relationshipTypes', this.listInDateRange);
        return router;
    };

}
