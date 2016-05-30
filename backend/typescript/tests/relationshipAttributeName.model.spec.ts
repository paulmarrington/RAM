import {connectDisconnectMongo, dropMongo} from './helpers';
import {IRelationshipAttributeName, RelationshipAttributeNameModel} from '../models/relationshipAttributeName.model';
import {RelationshipAttributeNameUsageModel} from '../models/relationshipAttributeNameUsage.model';
import {IRelationshipType, RelationshipTypeModel} from '../models/relationshipType.model';

/* tslint:disable:max-func-body-length */
describe('RAM Relationship Type', () => {

    connectDisconnectMongo();
    dropMongo();

    let relationshipType1: IRelationshipType;
    let relationshipAttributeNameNoEndDate: IRelationshipAttributeName;

    beforeEach(async (done) => {

        try {

            relationshipAttributeNameNoEndDate = await RelationshipAttributeNameModel.create({
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
                        attributeName: relationshipAttributeNameNoEndDate
                    })
                ]
            });

            done();

        } catch (e) {
            fail('Because ' + e);
            done();
        }

    });

    it('find relationship type with inflated attributes', async (done) => {
        try {
            const instance = await RelationshipTypeModel.findValidByCode(relationshipType1.code);
            expect(instance).not.toBeNull();
            expect(instance.attributeNameUsages.length).toBe(1);
            expect(instance.attributeNameUsages[0].optionalInd).toBe(true);
            expect(instance.attributeNameUsages[0].attributeName.domain).toBe(relationshipAttributeNameNoEndDate.domain);
            expect(instance.attributeNameUsages[0].attributeName.purposeText).toBe(relationshipAttributeNameNoEndDate.purposeText);
            done();
        } catch (e) {
            fail('Because ' + e);
            done();
        }
    });

    it('find valid or invalid by code', async (done) => {
        try {
            const instance = await RelationshipAttributeNameModel.findByCode(relationshipAttributeNameNoEndDate.code);
            expect(instance).not.toBeNull();
            done();
        } catch (e) {
            fail('Because ' + e);
            done();
        }
    });

    it('fails insert with empty domain', async (done) => {
        try {
            await RelationshipAttributeNameModel.create({
                code: 'ATTRIBUTE_NAME_X',
                shortDecodeText: 'Some short decode text',
                longDecodeText: 'Some long decode text',
                startDate: new Date()
            });
            fail('should not have inserted with empty domain');
            done();
        } catch (e) {
            expect(e.name).toBe('ValidationError');
            done();
        }
    });

    it('fails insert with invalid domain', async (done) => {
        try {
            await RelationshipAttributeNameModel.create({
                code: 'ATTRIBUTE_NAME_X',
                shortDecodeText: 'Some short decode text',
                longDecodeText: 'Some long decode text',
                startDate: new Date(),
                domain: '__BOGUS__',
                purposeText: 'This attribute is for name 1'
            });
            fail('should not have inserted with invalid domain');
            done();
        } catch (e) {
            expect(e.name).toBe('ValidationError');
            done();
        }
    });

    it('fails insert with empty purpose text', async (done) => {
        try {
            await RelationshipAttributeNameModel.create({
                code: 'ATTRIBUTE_NAME_X',
                shortDecodeText: 'Some short decode text',
                longDecodeText: 'Some long decode text',
                startDate: new Date(),
                domain: 'STRING'
            });
            fail('should not have inserted with empty purpose text');
            done();
        } catch (e) {
            expect(e.name).toBe('ValidationError');
            done();
        }
    });

    it('fails insert with duplicate code', async (done) => {
        try {

            const code = 'CODE_DUPLICATE';

            await RelationshipAttributeNameModel.create({
                code: code,
                shortDecodeText: 'Some short decode text',
                longDecodeText: 'Some long decode text',
                startDate: new Date(),
                domain: 'STRING',
                purposeText: 'This attribute is for name 1'
            });

            await RelationshipAttributeNameModel.create({
                code: code,
                shortDecodeText: 'Some short decode text',
                longDecodeText: 'Some long decode text',
                startDate: new Date(),
                domain: 'STRING',
                purposeText: 'This attribute is for name 1'
            });

            fail('should not have inserted with duplicate code');
            done();

        } catch (e) {
            expect(e.name).toBe('ValidationError');
            expect(e.errors.code.message).toContain('unique');
            done();
        }
    });


});