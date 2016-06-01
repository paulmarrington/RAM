import {Router, Request, Response} from 'express';
import {sendResource, sendList, sendError, sendNotFoundError, validateReqSchema} from './helpers';
import {IHrefValue} from '../../../commons/RamAPI';
import {IRelationshipType} from '../models/relationshipType.model';
import {IRelationshipTypeModel } from '../models/relationshipType.model';
import {IRelationshipType as IRelationshipTypeDTO} from '../../../commons/RamAPI';
import {IRelationshipAttributeName as IRelationshipAttributeNameDTO} from '../../../commons/RamAPI';
import {IRelationshipAttributeNameUsage as IRelationshipAttributeNameUsageDTO} from '../../../commons/RamAPI';

export class RelationshipTypeController {

    constructor(private relationshipTypeModel: IRelationshipTypeModel) {
    }

    private mapToIHrefValue = (relationshipType:IRelationshipType):IHrefValue<IRelationshipTypeDTO> => {
        if (relationshipType) {
            return new IHrefValue(
                '/api/v1/relationshipType/' + relationshipType.code,
                this.mapToResponseObject(relationshipType)
            );
        }
        return null;
    };

    private mapToResponseObject = (relationshipType:IRelationshipType):IRelationshipTypeDTO => {
        if (relationshipType) {
            return new IRelationshipTypeDTO(
                relationshipType.code,
                relationshipType.shortDecodeText,
                relationshipType.longDecodeText,
                relationshipType.startDate,
                relationshipType.endDate,
                relationshipType.voluntaryInd,
                relationshipType.attributeNameUsages.map((attributeNameUsage) => {
                    const attributeName = attributeNameUsage.attributeName;
                    return new IRelationshipAttributeNameUsageDTO(
                        !attributeNameUsage.optionalInd,
                        attributeNameUsage.defaultValue,
                        new IHrefValue(
                            '/api/v1/relationshipAttributeName/' + attributeNameUsage.attributeName.code,
                            new IRelationshipAttributeNameDTO(
                                attributeName.code,
                                attributeName.shortDecodeText,
                                attributeName.longDecodeText,
                                attributeName.startDate,
                                attributeName.endDate,
                                attributeName.shortDecodeText,
                                attributeName.domain,
                                attributeName.permittedValues
                            )
                        )
                    );
                })
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
            .then((req:Request) => this.relationshipTypeModel.findByCodeIgnoringDateRange(req.params.code))
            .then(this.mapToResponseObject)
            .then(sendResource(res), sendError(res))
            .then(sendNotFoundError(res));
    };

    private listIgnoringDateRange = async (req: Request, res: Response) => {
        const schema = {};
        validateReqSchema(req, schema)
            .then((req:Request) => this.relationshipTypeModel.listIgnoringDateRange())
            .then((results) => results ? results.map(this.mapToIHrefValue) : null)
            .then(sendList(res), sendError(res))
            .then(sendNotFoundError(res));
    };

    public assignRoutes = (router: Router) => {
        router.get('/v1/relationshipType/:code', this.findByCodeIgnoringDateRange);
        router.get('/v1/relationshipTypes', this.listIgnoringDateRange);
        return router;
    };

}
