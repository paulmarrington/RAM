import {Router, Request, Response} from 'express';
import {sendResource, sendList, sendError, sendNotFoundError, validateReqSchema} from './helpers';
import {IHrefValue} from '../../../commons/RamAPI';
import {IRelationshipAttributeName} from '../models/relationshipAttributeName.model';
import {IRelationshipAttributeNameModel} from '../models/relationshipAttributeName.model';
import {IRelationshipAttributeName as IRelationshipAttributeNameDTO} from '../../../commons/RamAPI';

export class RelationshipAttributeNameController {

    constructor(private relationshipAttributeNameModel: IRelationshipAttributeNameModel) {
    }

    private mapToResponseObject = (relationshipAttributeName:IRelationshipAttributeName):IRelationshipAttributeNameDTO => {
        if (relationshipAttributeName) {
            return {
                code: relationshipAttributeName.code,
                shortDecodeText: relationshipAttributeName.shortDecodeText,
                longDecodeText: relationshipAttributeName.longDecodeText,
                startTimestamp: relationshipAttributeName.startDate,
                endTimestamp: relationshipAttributeName.endDate,
                name: relationshipAttributeName.shortDecodeText,
                domain: relationshipAttributeName.domain,
                permittedValues: relationshipAttributeName.permittedValues
            } as IRelationshipAttributeNameDTO;
        }
        return null;
    };

    private findByCodeInDateRange = async (req: Request, res: Response) => {
        const schema = {
            'code': {
                notEmpty: true,
                errorMessage: 'Code is not valid'
            }
        };
        validateReqSchema(req, schema)
            .then((req:Request) => this.relationshipAttributeNameModel.findByCodeInDateRange(req.params.code))
            .then(this.mapToResponseObject)
            .then(sendResource(res), sendError(res))
            .then(sendNotFoundError(res));
    };

    private listInDateRange = async (req: Request, res: Response) => {
        const schema = {};
        validateReqSchema(req, schema)
            .then((req:Request) => this.relationshipAttributeNameModel.listInDateRange())
            .then((results) => results ? results.map(this.mapToResponseObject) : null)
            .then(sendList(res), sendError(res))
            .then(sendNotFoundError(res));
    };

    public assignRoutes = (router: Router) => {
        router.get('/v1/relationshipAttributeName/:code', this.findByCodeInDateRange);
        router.get('/v1/relationshipAttributeNames', this.listInDateRange);
        return router;
    };

}
