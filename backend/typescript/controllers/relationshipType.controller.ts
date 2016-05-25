import {sendDocument, sendError, sendNotFoundError} from './helpers';
import {Router, Request, Response} from 'express';
import { IRelationshipType, IRelationshipTypeModel } from '../models/relationshipType.model';

export class RelationshipTypeController {

    constructor(private relationshipTypeModel:IRelationshipTypeModel) {
    }

    private findById = async (req:Request, res:Response) => {
        try {
            console.log('RelationshipTypeController.findById() :: ', this.relationshipTypeModel);
            const model = await this.relationshipTypeModel.findValidById(req.params.id);
            console.log('Got it :: ' + model);
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
