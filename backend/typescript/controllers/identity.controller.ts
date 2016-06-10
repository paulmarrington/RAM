import {Router, Request, Response} from 'express';
import {sendResource, sendList, sendError, sendNotFoundError, validateReqSchema} from './helpers';
import {IIdentityModel } from '../models/identity.model';
/**
 * Development only controller to allow access to all identities in the system.
 */
export class IdentityController {

    constructor(private identityModel:IIdentityModel) {
    }

    private search = async (req:Request, res:Response) => {

        const schema = {};
        validateReqSchema(req, schema)
            .then((req:Request) => this.identityModel.search(req.params.page, 10))
            .then((results) => results ? results.map((model) => model.toHrefValue()) : null)
            .then(sendList(res), sendError(res))
            .then(sendNotFoundError(res));
    };

    public assignRoutes = (router:Router) => {
        router.get('/v1/identities', this.search);
        return router;
    };

}
