import {Router, Request, Response} from 'express';
import {given, validate, sendResource, sendList, sendError, sendNotFoundError} from './helpers';
import {IRelationshipAttributeName, IRelationshipAttributeNameModel} from '../models/relationshipAttributeName.model';

export class RelationshipAttributeNameController {

    constructor(private relationshipAttributeNameModel:IRelationshipAttributeNameModel) {
    }

    private findByCodeIgnoringDateRange = async (req:Request, res:Response) => {
        given(req)
            .then(validate((req:Request) => {
                req.checkParams('code', 'Code is not valid').notEmpty();
            }))
            .then((req:Request) => this.relationshipAttributeNameModel.findByCodeIgnoringDateRange(req.params.code))
            .then((model) => model ? model.toDTO() : null)
            .then(sendResource(res), sendError(res))
            .then(sendNotFoundError(res));
    };

    private listIgnoringDateRange = async (req:Request, res:Response) => {
        given(req)
            .then((req:Request) => this.relationshipAttributeNameModel.listIgnoringDateRange())
            .then((results:IRelationshipAttributeName[]) => results ? results.map((model) => model.toHrefValue()) : null)
            .then(sendList(res), sendError(res))
            .then(sendNotFoundError(res));
    };

    public assignRoutes = (router:Router) => {
        router.get('/v1/relationshipAttributeName/:code', this.findByCodeIgnoringDateRange);
        router.get('/v1/relationshipAttributeNames', this.listIgnoringDateRange);
        return router;
    };

}
