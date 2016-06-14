import {Router, Request, Response} from 'express';
import {sendResource, sendError, sendNotFoundError, validateReqSchema, sendSearchResult} from './helpers';
import {Headers} from './headers';
import {conf} from '../bootstrap';
import {IIdentityModel} from '../models/identity.model';

export class IdentityController {

    constructor(private identityModel:IIdentityModel) {
    }

    private findMe = async (req:Request, res:Response) => {
        const schema = {};
        validateReqSchema(req, schema)
            .then((req:Request) => res.locals[Headers.Identity])
            .then((model) => model ? model.toDTO() : null)
            .then(sendResource(res), sendError(res))
            .then(sendNotFoundError(res));
    };

    private findByIdentityIdValue = async (req:Request, res:Response) => {
        const schema = {
            'idValue': {
                in: 'params',
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

    private findPendingByInvitationCodeInDateRange = async (req:Request, res:Response) => {
        const schema = {
            'invitationCode': {
                notEmpty: true,
                errorMessage: 'Invitation Code is not valid'
            }
        };
        validateReqSchema(req, schema)
            .then((req:Request) => this.identityModel.findPendingByInvitationCodeInDateRange(req.params.invitationCode, new Date()))
            .then((model) => model ? model.toDTO() : null)
            .then(sendResource(res), sendError(res))
            .then(sendNotFoundError(res));
    };

    private search = async (req:Request, res:Response) => {
        const schema = {
            'page': {
                in: 'query',
                notEmpty: true,
                errorMessage: 'Page is not valid'
            }
        };
        validateReqSchema(req, schema)
            .then((req:Request) => this.identityModel.search(req.params.page, 10))
            .then((results) => (results.map((model) => model.toHrefValue(true))))
            .then(sendSearchResult(res), sendError(res))
            .then(sendNotFoundError(res));
    };

    public assignRoutes = (router:Router) => {
        router.get('/v1/identity/me', this.findMe);
        router.get('/v1/identity/:idValue', this.findByIdentityIdValue);
        router.get('/v1/identity/invitationCode/:invitationCode', this.findPendingByInvitationCodeInDateRange);
        if (conf.devMode) {
            router.get('/v1/identities', this.search);
        }
        return router;
    };

}
