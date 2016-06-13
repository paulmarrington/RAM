import {Router, Request, Response} from 'express';
import {sendResource, sendError, sendNotFoundError, validateReqSchema, sendSearchResult} from './helpers';
import {IIdentityModel } from '../models/identity.model';

export class IdentityController {

    constructor(private identityModel:IIdentityModel) {
    }

    // TODO consider moving this to party controller and returning the party object
    private me = async (req:Request, res:Response) => {
        req.params.idValue = res.locals['X-RAM-Identity-IdValue'];
        this.findByIdentityIdValue(req, res);
    };

    private findByIdentityIdValue = async (req:Request, res:Response) => {
        const schema = {
            'idValue': {
                notEmpty: true,
                errorMessage: 'Id Value is not valid'
            }
        };
        validateReqSchema(req, schema)
            .then((req:Request) => this.identityModel.findByIdValue(req.params.idValue))
            .then((model) => model ? model.toDTO() : null)
            .then(sendResource(res), sendError(res))
            .then(sendNotFoundError(res));
    };

    private search = async (req:Request, res:Response) => {
        const schema = {};
        validateReqSchema(req, schema)
            .then((req:Request) => this.identityModel.search(req.params.page, 10))
            .then((results) => (results.map((model) => model.toHrefValue(true))))
            .then(sendSearchResult(res), sendError(res))
            .then(sendNotFoundError(res));
    };

    public assignRoutes = (router:Router) => {
        router.get('/v1/identity/me', this.me);
        router.get('/v1/identity/:idValue', this.findByIdentityIdValue);
        router.get('/v1/identities', this.search);
        return router;
    };

}
