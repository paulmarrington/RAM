import {Router, Request, Response} from 'express';
import {security} from './security.middleware';
import {sendError, sendNotFoundError, validateReqSchema, sendResource, sendSearchResult} from './helpers';
import {IRelationshipModel} from '../models/relationship.model';
import {RelationshipAddDTO, CreateIdentityDTO, AttributeDTO} from '../../../commons/RamAPI';
import {PartyModel} from '../models/party.model';
import {ProfileProvider} from '../models/profile.model';
import {IdentityType} from '../models/identity.model';

// todo add data security
export class RelationshipController {

    constructor(private relationshipModel:IRelationshipModel) {
    }

    private findByIdentifier = async (req:Request, res:Response) => {
        const schema = {
            'identifier': {
                in: 'params',
                notEmpty: true,
                errorMessage: 'Identifier is not valid'
            }
        };
        validateReqSchema(req, schema)
            .then((req:Request) => this.relationshipModel.findByIdentifier(req.params.identifier))
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
            .then((req:Request) => this.relationshipModel.findPendingByInvitationCodeInDateRange(req.params.invitationCode, new Date()))
            .then((model) => model ? model.toDTO() : null)
            .then(sendResource(res), sendError(res))
            .then(sendNotFoundError(res));
    };

    private acceptByInvitationCode = async (req:Request, res:Response) => {
        const schema = {
            'invitationCode': {
                notEmpty: true,
                errorMessage: 'Invitation Code is not valid'
            }
        };
        validateReqSchema(req, schema)
            .then((req:Request) => this.relationshipModel.findPendingByInvitationCodeInDateRange(req.params.invitationCode, new Date()))
            .then((model) => model ? model.acceptPendingInvitation(security.getAuthenticatedIdentity(res)) : null)
            .then((model) => model ? model.toDTO() : null)
            .then(sendResource(res), sendError(res))
            .then(sendNotFoundError(res));
    };

    private rejectByInvitationCode = async (req:Request, res:Response) => {
        const schema = {
            'invitationCode': {
                notEmpty: true,
                errorMessage: 'Invitation Code is not valid'
            }
        };
        validateReqSchema(req, schema)
            .then((req:Request) => this.relationshipModel.findPendingByInvitationCodeInDateRange(req.params.invitationCode, new Date()))
            .then((model) => model ? model.rejectPendingInvitation() : null)
            .then((model) => Promise.resolve({}))
            .then(sendResource(res), sendError(res))
            .then(sendNotFoundError(res));
    };

    /* tslint:disable:max-func-body-length */
    private listBySubjectOrDelegate = async (req:Request, res:Response) => {
        const schema = {
            'subject_or_delegate': {
                in: 'params',
                notEmpty: true,
                errorMessage: 'Subject Or Delegate is not valid',
                matches: {
                    options: ['^(subject|delegate)$'],
                    errorMessage: 'Subject Or Delegate is not valid'
                }
            },
            'identity_id': {
                in: 'params',
                notEmpty: true,
                errorMessage: 'Identity Id is not valid'
            },
            'page': {
                in: 'query',
                notEmpty: true,
                isNumeric: {
                    errorMessage: 'Page is not valid'
                }
            },
            'pageSize': {
                in: 'query',
                optional: true,
                isNumeric: {
                    errorMessage: 'Page Size is not valid'
                }
            }
        };
        validateReqSchema(req, schema)
            .then((req:Request) => this.relationshipModel.search(
                req.params.subject_or_delegate === 'subject' ? req.params.identity_id : null,
                req.params.subject_or_delegate === 'delegate' ? req.params.identity_id : null,
                req.query.page,
                req.query.pageSize)
            )
            .then((results) => (results.map((model) => model.toHrefValue(true))))
            .then(sendSearchResult(res), sendError(res))
            .then(sendNotFoundError(res));
    };

    private create = async (req:Request, res:Response) => {
        const schema = {}; // TODO when DTO is confirmed with front end
        validateReqSchema(req, schema)
            .then((req:Request) => {
                return PartyModel.findByIdentityIdValue(req.body.subject);
            })
            .then((subjectParty) => {
                return subjectParty.addRelationship(
                    new RelationshipAddDTO(
                        req.body.relationshipType,
                        req.body.subject,
                        new CreateIdentityDTO(
                            undefined,
                            req.body.delegate.partyType,
                            req.body.delegate.givenName,
                            req.body.delegate.familyName,
                            req.body.delegate.unstructuredName,
                            req.body.delegate.sharedSecret.code,
                            req.body.delegate.sharedSecret.value,
                            IdentityType.InvitationCode.name,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            ProfileProvider.Temp.name
                        ),
                        new Date(req.body.startTimestamp),
                        new Date(req.body.endTimestamp),
                        AttributeDTO.build(req.body.attributes)
                    ));
            })
            .then((model) => model ? model.toDTO() : null)
            .then(sendResource(res), sendError(res))
            .then(sendNotFoundError(res));
    };

    public assignRoutes = (router:Router) => {

        router.get('/v1/relationship/:identifier',
            security.isAuthenticated,
            this.findByIdentifier);

        router.get('/v1/relationship/invitationCode/:invitationCode',
            security.isAuthenticated,
            this.findPendingByInvitationCodeInDateRange);

        router.post('/v1/relationship/invitationCode/:invitationCode/accept',
            security.isAuthenticated,
            this.acceptByInvitationCode);

        router.post('/v1/relationship/invitationCode/:invitationCode/reject',
            security.isAuthenticated,
            this.rejectByInvitationCode);

        router.get('/v1/relationships/:subject_or_delegate/identity/:identity_id',
            security.isAuthenticated,
            this.listBySubjectOrDelegate);

        router.post('/v1/relationship',
            security.isAuthenticated,
            this.create);

        return router;

    };
}
