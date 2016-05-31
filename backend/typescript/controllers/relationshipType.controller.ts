import {sendDocument, sendError, sendNotFoundError, validateReqSchema} from './helpers';
import {Router, Request, Response} from 'express';
import {IRelationshipTypeModel } from '../models/relationshipType.model';
import {sendResource} from './helpers';
import {IRelationshipType} from '../models/relationshipType.model';
import {IRelationshipType as IRelationshipTypeDTO} from '../../../commons/RamAPI';
import {IRelationshipAttributeName as IRelationshipAttributeNameDTO} from '../../../commons/RamAPI';

export class RelationshipTypeController {

    constructor(private relationshipTypeModel: IRelationshipTypeModel) {
    }

    private mapToResponseObject = (relationshipType:IRelationshipType):IRelationshipTypeDTO => {
        console.log(relationshipType.attributeNameUsages);
        return {
            code: relationshipType.code,
            shortDecodeText: relationshipType.shortDecodeText,
            longDecodeText: relationshipType.longDecodeText,
            startDate: relationshipType.startDate,
            endDate: relationshipType.endDate,
            voluntaryInd: relationshipType.voluntaryInd,
            attributeDefs: relationshipType.attributeNameUsages.map((attributeNameUsage) => {
                return {
                    code: attributeNameUsage.attributeName.code,
                    shortDecodeText: attributeNameUsage.attributeName.shortDecodeText,
                    longDecodeText: attributeNameUsage.attributeName.longDecodeText,
                    startDate: attributeNameUsage.attributeName.startDate,
                    name: attributeNameUsage.attributeName.shortDecodeText,
                    domain: attributeNameUsage.attributeName.domain,
                    mandatory: !attributeNameUsage.optionalInd,
                    defaultValue: attributeNameUsage.defaultValue,
                    permittedValues: attributeNameUsage.attributeName.permittedValues
                } as IRelationshipAttributeNameDTO;
            })
        } as IRelationshipTypeDTO;
    };

    private findByCodeInDateRange = async (req: Request, res: Response) => {
        const schema = {
            'code': {
                notEmpty: true,
                errorMessage: 'Code is not valid'
            }
        };
        validateReqSchema(req, schema)
            .then((req:Request) => this.relationshipTypeModel.findByCodeInDateRange(req.params.code))
            .then(this.mapToResponseObject)
            .then(sendResource(res), sendError(res))
            .then(sendNotFoundError(res));
    };

    private listInDateRange = async (req: Request, res: Response) => {
        const schema = {};
        validateReqSchema(req, schema)
            .then((req:Request) => this.relationshipTypeModel.listInDateRange())
            .then((results) => results.map(this.mapToResponseObject))
            .then(sendDocument(res), sendError(res))
            .then(sendNotFoundError(res));
    };

    public assignRoutes = (router: Router) => {
        router.get('/v1/relationshipType/:code', this.findByCodeInDateRange);
        router.get('/v1/relationshipTypes', this.listInDateRange);
        return router;
    };

}
