import {sendDocument, sendError, sendNotFoundError, validateReqSchema} from './helpers';
import {Router, Request, Response} from 'express';
import {IRelationshipTypeModel } from '../models/relationshipType.model';

export class RelationshipTypeController {

    constructor(private relationshipTypeModel: IRelationshipTypeModel) {
    }

    private findValidById = async (req: Request, res: Response) => {
        const schema = {
            'id': {
                notEmpty: true,
                isMongoId: {
                },
                errorMessage: 'Id is not valid'
            }
        };
        validateReqSchema(req, schema)
            .then((req:Request) => this.relationshipTypeModel.findValidById(req.params.id), sendError(res))
            .then(sendDocument(res), sendNotFoundError(res));
    };

    private listValid = async (req: Request, res: Response) => {
        try {
            const results = await this.relationshipTypeModel.listValid();
            sendDocument(res)(results);
        } catch (e) {
            sendError(res)(e);
        }
    };

    public assignRoutes = (router: Router) => {
        router.get('/v1/relationshipType/:id', this.findValidById);
        router.get('/v1/relationshipTypes', this.listValid);
        return router;
    };

}
