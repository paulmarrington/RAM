import {Router, Request, Response} from 'express';
import {security} from './security.middleware';
import {sendResource, sendList, sendError, sendNotFoundError, validateReqSchema} from './helpers';
import {Headers} from './headers';
import {IProfileModel, ProfileProvider} from '../models/profile.model';

export class ProfileController {

    constructor(private profileModel:IProfileModel) {
    }
    
    private findProviderByName = (req:Request, res:Response) => {
        const schema = {
            'name': {
                in: 'params',
                notEmpty: true,
                errorMessage: 'Name is not valid'
            }
        };
        validateReqSchema(req, schema)
            .then((req:Request) => ProfileProvider.valueOf(req.params.name))
            .then((model) => model ? model.toDTO() : null)
            .then(sendResource(res), sendError(res))
            .then(sendNotFoundError(res));
    };

    private listProviders = (req:Request, res:Response) => {
        const schema = {
        };
        validateReqSchema(req, schema)
            .then((req:Request) => ProfileProvider.values())
            .then((results) => results ? results.map((model) => model.toHrefValue(true)) : null)
            .then(sendList(res), sendError(res))
            .then(sendNotFoundError(res));
    };

    public assignRoutes = (router:Router) => {

        router.get('/v1/profileProvider/:name',
            this.findProviderByName);

        router.get('/v1/profileProviders',
            this.listProviders);

        return router;

    };

}