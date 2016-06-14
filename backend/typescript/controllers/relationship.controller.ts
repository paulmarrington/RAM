import {Router, Request, Response} from 'express';
import {sendError, sendNotFoundError, validateReqSchema, sendSearchResult} from './helpers';
import {IRelationshipModel} from '../models/relationship.model';

export class RelationshipController {

    constructor(private relationshipModel:IRelationshipModel) {
    }

    private search = async (req:Request, res:Response) => {
        const schema = {
            
            
        };
        validateReqSchema(req, schema)
            .then((req:Request) => this.relationshipModel.search(req.params.page, 10))
            .then((results) => (results.map((model) => model.toHrefValue(true))))
            .then(sendSearchResult(res), sendError(res))
            .then(sendNotFoundError(res));
    };

    public assignRoutes = (router:Router) => {
        router.get('/v1/relationships', this.search);
        return router;
    };

}
