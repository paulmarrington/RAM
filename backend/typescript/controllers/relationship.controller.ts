import {Router, Request, Response} from 'express';
import {sendError, sendNotFoundError, validateReqSchema, sendResource, sendSearchResult} from './helpers';
import {IRelationshipModel} from '../models/relationship.model';

// todo add data security
export class RelationshipController {

    private static SEARCH_SCHEMA = {
        'page': {
            in: 'query',
            notEmpty: true,
            errorMessage: 'Page is not valid'
        },
        'pageSize': {
            in: 'query',
            optional: true,
            isNumeric: {
                errorMessage: 'Page Size is not valid'
            }
        },
        'identity_id': {
            in: 'path',
            notEmpty: true,
            errorMessage: 'Identity Id is not valid'
        }
    };

    constructor(private relationshipModel:IRelationshipModel) {
    }

    private findByIdentifier = async(req:Request, res:Response) => {
        const schema = {
            'id': {
                in: 'params',
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

    private subject = async(req:Request, res:Response) => {

        validateReqSchema(req, RelationshipController.SEARCH_SCHEMA)
            .then((req:Request) => this.relationshipModel.search(req.params.identity_id, null, req.query.page, req.query.pageSize))
            .then((results) => (results.map((model) => model.toHrefValue(true))))
            .then(sendSearchResult(res), sendError(res))
            .then(sendNotFoundError(res));
    };

    private delegate = async(req:Request, res:Response) => {

        validateReqSchema(req, RelationshipController.SEARCH_SCHEMA)
            .then((req:Request) => this.relationshipModel.search(null, req.params.identity_id, req.query.page, req.query.pageSize))
            .then((results) => (results.map((model) => model.toHrefValue(true))))
            .then(sendSearchResult(res), sendError(res))
            .then(sendNotFoundError(res));
    };

    public assignRoutes = (router:Router) => {
        router.get('/v1/relationship/:id', this.findByIdentifier);
        router.get('/v1/relationships/subject/identity/:identity_id', this.subject);
        router.get('/v1/relationships/delegate/identity/:identity_id', this.delegate);
        return router;
    };
}
