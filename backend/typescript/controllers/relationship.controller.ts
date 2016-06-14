import {Router, Request, Response} from 'express';
import {sendError, sendNotFoundError, validateReqSchema, sendResource, sendSearchResult} from './helpers';
import {IRelationshipModel} from '../models/relationship.model';

// todo add data security
export class RelationshipController {

    constructor(private relationshipModel:IRelationshipModel) {
    }

    private findByIdentifier = async (req:Request, res:Response) => {
        const schema = {
            'id': {
                notEmpty: true,
                errorMessage: 'Id is not valid'
            }
        };
        validateReqSchema(req, schema)
            .then((req:Request) => this.relationshipModel.findByIdentifier(req.params.id))
            .then((model) => model ? model.toDTO() : null)
            .then(sendResource(res), sendError(res))
            .then(sendNotFoundError(res));
    };
    
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
        // todo use correct paths
        router.get('/v1/relationship/:id', this.findByIdentifier);
        router.get('/v1/relationships', this.search);
        return router;
    };
}
