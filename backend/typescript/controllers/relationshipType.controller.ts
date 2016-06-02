import {Router, Request, Response} from 'express';
import {sendResource, sendList, sendError, sendNotFoundError, validateReqSchema} from './helpers';
import {IRelationshipTypeModel } from '../models/relationshipType.model';

export class RelationshipTypeController {

    constructor(private relationshipTypeModel:IRelationshipTypeModel) {
    }

    private findByCodeIgnoringDateRange = async (req:Request, res:Response) => {
        const schema = {
            'code': {
                notEmpty: true,
                errorMessage: 'Code is not valid'
            }
        };
        validateReqSchema(req, schema)
            .then((req:Request) => this.relationshipTypeModel.findByCodeIgnoringDateRange(req.params.code))
            .then((model) => model.toDTO())
            .then(sendResource(res), sendError(res))
            .then(sendNotFoundError(res));
    };

    private listIgnoringDateRange = async (req:Request, res:Response) => {
        const schema = {};
        validateReqSchema(req, schema)
            .then((req:Request) => this.relationshipTypeModel.listIgnoringDateRange())
            .then((results) => results ? results.map((model) => model.toHrefValue()) : null)
            .then(sendList(res), sendError(res))
            .then(sendNotFoundError(res));
    };

    public assignRoutes = (router:Router) => {
        router.get('/v1/relationshipType/:code', this.findByCodeIgnoringDateRange);
        router.get('/v1/relationshipTypes', this.listIgnoringDateRange);
        return router;
    };

}
