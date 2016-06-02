import {Router, Request, Response} from 'express';
import {given, validate, sendResource, sendList, sendError, sendNotFoundError} from './helpers';
import {IRelationshipType, IRelationshipTypeModel} from '../models/relationshipType.model';

export class RelationshipTypeController {

    constructor(private relationshipTypeModel:IRelationshipTypeModel) {
    }

    private findByCodeIgnoringDateRange = async (req:Request, res:Response) => {
        given(req)
            .then(validate((req:Request) => {
                req.checkParams('code', 'Code is not valid').notEmpty();
            }))
            .then((req:Request) => this.relationshipTypeModel.findByCodeIgnoringDateRange(req.params.code))
            .then((model) => model ? model.toDTO() : null)
            .then(sendResource(res), sendError(res))
            .then(sendNotFoundError(res));
    };

    private listIgnoringDateRange = async (req:Request, res:Response) => {
        given(req)
            .then((req:Request) => this.relationshipTypeModel.listIgnoringDateRange())
            .then((results:IRelationshipType[]) => results ? results.map((model) => model.toHrefValue()) : null)
            .then(sendList(res), sendError(res))
            .then(sendNotFoundError(res));
    };

    public assignRoutes = (router:Router) => {
        router.get('/v1/relationshipType/:code', this.findByCodeIgnoringDateRange);
        router.get('/v1/relationshipTypes', this.listIgnoringDateRange);
        return router;
    };

}
