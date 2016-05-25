import {sendDocument, sendError, sendNotFoundError} from './helpers';
import {Router, Request, Response} from 'express';
import { IRelationshipType, IRelationshipTypeModel } from '../models/relationshipType.model';

export class RelationshipTypeController {

    constructor(private relationshipTypeModel:IRelationshipTypeModel) {
    }

    private findValidById = async (req:Request, res:Response) => {
        try {
            const model = await this.relationshipTypeModel.findValidById(req.params.id);
            if (model) {
                sendDocument(res)(model);
            } else {
                sendNotFoundError(res)();
            }
        } catch (e) {
            sendError(res)(e);
        }
    };

    private listValid = async (req:Request, res:Response) => {
        try {
            const results = await this.relationshipTypeModel.listValid();
            if (results) {
                sendDocument(res)(results);
            } else {
                sendNotFoundError(res)();
            }
        } catch (e) {
            sendError(res)(e);
        }
    }

    public assignRoutes = (router:Router) => {
        router.get('/:id', this.findValidById);
        router.get('', this.listValid);
        return router;
    };

}
