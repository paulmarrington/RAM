import {Router, Request, Response} from 'express';
import {sendResource, sendList, sendError, sendNotFoundError, validateReqSchema} from './helpers';
import {IHrefValue} from '../../../commons/RamAPI';
import {IRelationshipAttributeName} from '../models/relationshipAttributeName.model';
import {IRelationshipAttributeNameModel} from '../models/relationshipAttributeName.model';
import {IRelationshipAttributeName as IRelationshipAttributeNameDTO} from '../../../commons/RamAPI';

export class RelationshipAttributeNameController {

    constructor(private relationshipAttributeNameModel: IRelationshipAttributeNameModel) {
    }

    private mapToIHrefValue = (relationshipAttributeName:IRelationshipAttributeName):IHrefValue<IRelationshipAttributeNameDTO> => {
        if (relationshipAttributeName) {
            return new IHrefValue(
                '/api/v1/relationshipAttributeName/' + relationshipAttributeName.code,
                this.mapToResponseObject(relationshipAttributeName)
            );
        }
        return null;
    };

    private mapToResponseObject = (relationshipAttributeName:IRelationshipAttributeName):IRelationshipAttributeNameDTO => {
        if (relationshipAttributeName) {
            return new IRelationshipAttributeNameDTO(
                relationshipAttributeName.code,
                relationshipAttributeName.shortDecodeText,
                relationshipAttributeName.longDecodeText,
                relationshipAttributeName.startDate,
                relationshipAttributeName.endDate,
                relationshipAttributeName.shortDecodeText,
                relationshipAttributeName.domain,
                relationshipAttributeName.permittedValues
            );
        }
        return null;
    };

    private findByCodeIgnoringDateRange = async (req: Request, res: Response) => {
        const schema = {
            'code': {
                notEmpty: true,
                errorMessage: 'Code is not valid'
            }
        };
        validateReqSchema(req, schema)
            .then((req:Request) => this.relationshipAttributeNameModel.findByCodeIgnoringDateRange(req.params.code))
            .then(this.mapToResponseObject)
            .then(sendResource(res), sendError(res))
            .then(sendNotFoundError(res));
    };

    private listIgnoringDateRange = async (req: Request, res: Response) => {
        const schema = {};
        validateReqSchema(req, schema)
            .then((req:Request) => this.relationshipAttributeNameModel.listIgnoringDateRange())
            .then((results) => results ? results.map(this.mapToIHrefValue) : null)
            .then(sendList(res), sendError(res))
            .then(sendNotFoundError(res));
    };

    public assignRoutes = (router: Router) => {
        router.get('/v1/relationshipAttributeName/:code', this.findByCodeIgnoringDateRange);
        router.get('/v1/relationshipAttributeNames', this.listIgnoringDateRange);
        return router;
    };

}
