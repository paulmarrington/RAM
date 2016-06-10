import {Router, Request, Response} from 'express';
import {sendResource, sendError, sendNotFoundError, validateReqSchema} from './helpers';
import {IPartyModel} from '../models/party.model';

export class PartyController {

    constructor(private partyModel:IPartyModel) {
    }

    private findByIdentityIdValue = (req:Request, res:Response) => {
        const schema = {
            'idValue': {
                notEmpty: true,
                errorMessage: 'Id Value is not valid'
            }
        };
        validateReqSchema(req, schema)
            .then((req:Request) => this.partyModel.findByIdentityIdValue(req.params.idValue))
            .then((model) => model ? model.toDTO() : null)
            .then(sendResource(res), sendError(res))
            .then(sendNotFoundError(res));
    };

    public assignRoutes = (router:Router) => {
        router.get('/v1/parties/identities/:idValue', this.findByIdentityIdValue);
        return router;
    };

}