import {connectDisconnectMongo, dropMongo} from './helpers';
import {IRelationshipType, RelationshipTypeModel} from '../models/relationshipType.model';

/* tslint:disable:max-func-body-length */
describe('RAM Relationship Type', () => {

    connectDisconnectMongo();
    dropMongo();

    let relationshipTypeNoEndDate: IRelationshipType;
    let relationshipTypeFutureEndDate: IRelationshipType;
    let relationshipTypeExpired: IRelationshipType;

    beforeEach(async (done) => {

        try {

            relationshipTypeNoEndDate = await RelationshipTypeModel.create({
                code: 'RELATIONSHIP_TYPE_1',
                shortDecodeText: 'Relationship Type 1',
                longDecodeText: 'Relationship Type 1',
                startDate: new Date(),
                attributeNameUsages: []
            });

            relationshipTypeFutureEndDate = await RelationshipTypeModel.create({
                code: 'RELATIONSHIP_TYPE_2',
                shortDecodeText: 'Relationship Type 2',
                longDecodeText: 'Relationship Type 2',
                startDate: new Date(),
                endDate: new Date(2099, 1, 1)
            });

            relationshipTypeExpired = await RelationshipTypeModel.create({
                code: 'RELATIONSHIP_TYPE_3',
                shortDecodeText: 'Relationship Type 3',
                longDecodeText: 'Relationship Type 3',
                startDate: new Date(2016, 1, 1),
                endDate: new Date(2016, 1, 2)
            });

            done();

        } catch (e) {
            fail('Because ' + e);
            done();
        }

    });

    it('find valid with no end date by code', async (done) => {
        try {
            const instance = await RelationshipTypeModel.findValidByCode(relationshipTypeNoEndDate.code);
            expect(instance).not.toBeNull();
            done();
        } catch (e) {
            fail('Because ' + e);
            done();
        }
    });

    it('find valid with future end date by code', async (done) => {
        try {
            const instance = await RelationshipTypeModel.findValidByCode(relationshipTypeFutureEndDate.code);
            expect(instance).not.toBeNull();
            done();
        } catch (e) {
            fail('Because ' + e);
            done();
        }
    });

    it('fails find valid by non-existent code', async (done) => {
        try {
            const code = '__BOGUS__';
            const instance = await RelationshipTypeModel.findValidByCode(code);
            expect(instance).toBeNull();
            done();
        } catch (e) {
            fail('Because ' + e);
            done();
        }
    });

    it('fails find invalid by code', async (done) => {
        try {
            const instance = await RelationshipTypeModel.findValidByCode(relationshipTypeExpired.code);
            expect(instance).toBeNull();
            done();
        } catch (e) {
            fail('Because ' + e);
            done();
        }
    });

    it('list valid', async (done) => {
        try {
            const instances = await RelationshipTypeModel.listValid();
            expect(instances).not.toBeNull();
            expect(instances.length).toBeGreaterThan(0);
            instances.forEach((instance) => {
                expect(instance.startDate.valueOf()).toBeLessThan(new Date().valueOf());
                if (instance.endDate) {
                    expect(instance.endDate.valueOf()).toBeGreaterThan(new Date().valueOf());
                }
            });
            done();
        } catch (e) {
            fail('Because ' + e);
            done();
        }
    });

    it('inserts with non-empty code', async (done) => {
        try {

            const instance = await RelationshipTypeModel.create({
                code: 'CODE_1',
                shortDecodeText: 'Some short decode text',
                longDecodeText: 'Some long decode text',
                startDate: new Date()
            });

            expect(instance).not.toBeNull();
            expect(instance.id).not.toBeNull();
            expect(instance.code).not.toBeNull();

            const retrievedInstance = await RelationshipTypeModel.findValidByCode(instance.code);
            expect(retrievedInstance).not.toBeNull();
            expect(retrievedInstance.id).toBe(instance.id);

            done();

        } catch (e) {
            fail('Because ' + e);
            done();
        }
    });

    it('fails insert with empty code', async (done) => {
        try {
            await RelationshipTypeModel.create({
                shortDecodeText: 'Some short decode text',
                longDecodeText: 'Some long decode text',
                startDate: new Date()
            });
            fail('should not have inserted with empty code');
            done();
        } catch (e) {
            expect(e.name).toBe('ValidationError');
            done();
        }
    });

    it('fails insert with duplicate code', async (done) => {
        try {

            const code = 'CODE_DUPLICATE';

            await RelationshipTypeModel.create({
                code: code,
                shortDecodeText: 'Some short decode text',
                longDecodeText: 'Some long decode text',
                startDate: new Date()
            });

            await RelationshipTypeModel.create({
                code: code,
                shortDecodeText: 'Some short decode text',
                longDecodeText: 'Some long decode text',
                startDate: new Date()
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