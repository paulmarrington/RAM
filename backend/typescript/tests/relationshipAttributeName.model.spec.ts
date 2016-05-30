import {connectDisconnectMongo, dropMongo} from './helpers';
import {IRelationshipAttributeName, RelationshipAttributeNameModel} from '../models/relationshipAttributeName.model';
import {RelationshipAttributeNameUsageModel} from '../models/relationshipAttributeNameUsage.model';
import {IRelationshipType, RelationshipTypeModel} from '../models/relationshipType.model';

/* tslint:disable:max-func-body-length */
describe('RAM Relationship Type', () => {

    connectDisconnectMongo();
    dropMongo();

    let relationshipType1: IRelationshipType;
    let relationshipAttributeName1: IRelationshipAttributeName;

    beforeEach(async (done) => {

        try {

            relationshipAttributeName1 = await RelationshipAttributeNameModel.create({
                code: 'ATTRIBUTE_NAME_1',
                shortDecodeText: 'Attribute Name 1',
                longDecodeText: 'Attribute Name 1',
                startDate: new Date(),
                domain: 'STRING',
                purposeText: 'This attribute is for name 1'
            });

            relationshipType1 = await RelationshipTypeModel.create({
                code: 'RELATIONSHIP_TYPE_1',
                shortDecodeText: 'Relationship Type 1',
                longDecodeText: 'Relationship Type 1',
                startDate: new Date(),
                attributeNameUsages: [
                    await RelationshipAttributeNameUsageModel.create({
                        optionalInd: true,
                        attributeName: relationshipAttributeName1
                    })
                ]
            });

            done();

        } catch (e) {
            fail('Because ' + e);
            done();
        }

    });

    it('find inflated attribute name usages', async (done) => {
        try {
            const instance = await RelationshipTypeModel.findValidByCode(relationshipType1.code);
            expect(instance).not.toBeNull();
            expect(instance.attributeNameUsages.length).toBe(1);
            expect(instance.attributeNameUsages[0].optionalInd).toBe(true);
            expect(instance.attributeNameUsages[0].attributeName.domain).toBe(relationshipAttributeName1.domain);
            expect(instance.attributeNameUsages[0].attributeName.purposeText).toBe(relationshipAttributeName1.purposeText);
            done();
        } catch (e) {
            fail('Because ' + e);
            done();
        }
    });

});