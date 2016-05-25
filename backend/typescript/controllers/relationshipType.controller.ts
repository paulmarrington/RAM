import {sendDocument, sendError, sendNotFoundError} from './helpers';
import {Router, Request, Response} from 'express';
import { IRelationshipType, IRelationshipTypeModel } from '../models/relationshipType.model';

export class RelationshipTypeController {

    constructor(private relationshipTypeModel:IRelationshipTypeModel) {
    }

    private findById = async (req:Request, res:Response) => {
        try {
            const model = await this.relationshipTypeModel.findValidById(req.params.id);
            if (model) {
                sendDocument(res)(model);
            } else {
                sendNotFoundError(res)();
            }
        } catch (e) {
            console.log('error with findById: ', e);
            sendError(res)(e);
        }
    };

    public assignRoutes = (router:Router) => {
        router.get('/:id', this.findById);
        return router;
    };

}
