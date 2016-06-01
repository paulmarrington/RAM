import {Router, Request, Response} from 'express';
import {sendResource, sendList, sendError, sendNotFoundError, checkParams} from './helpers';
import {IRelationshipAttributeNameModel} from '../models/relationshipAttributeName.model';

export class RelationshipAttributeNameController {

    constructor(private relationshipAttributeNameModel:IRelationshipAttributeNameModel) {
    }

    private findByCodeIgnoringDateRange = async (req:Request, res:Response) => {
        const schema = {
            'code': {
                in: 'query',
                notEmpty: true,
                errorMessage: 'Code is not valid'
            }
        };
        check(req, schema)
            .then((req:Request) => this.relationshipAttributeNameModel.findByCodeIgnoringDateRange(req.params.code))
            .then((model) => model.toDTO())
            .then(sendResource(res), sendError(res))
            .then(sendNotFoundError(res));
    };

    private listIgnoringDateRange = async (req:Request, res:Response) => {
        const schema = {};
        checkParams(req, schema)
            .then((req:Request) => this.relationshipAttributeNameModel.listIgnoringDateRange())
            .then((results) => results ? results.map((model) => model.toHrefValue()) : null)
            .then(sendList(res), sendError(res))
            .then(sendNotFoundError(res));
    };

    public assignRoutes = (router:Router) => {
        router.get('/v1/relationshipAttributeName/:code', this.findByCodeIgnoringDateRange);
        router.get('/v1/relationshipAttributeNames', this.listIgnoringDateRange);
        return router;
    };

}
