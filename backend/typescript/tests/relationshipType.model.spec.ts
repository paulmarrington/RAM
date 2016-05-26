import {connectDisconnectMongo} from './helpers';
import {IRelationshipType, RelationshipTypeModel} from '../models/relationshipType.model';
import {dropMongo} from "./helpers";

/* tslint:disable:max-func-body-length */
describe('RAM Relationship Type', () => {

    connectDisconnectMongo();
    dropMongo();

    let existingInstanceNoEndDate: IRelationshipType;
    let existingInstanceFutureEndDate: IRelationshipType;
    let existingExpiredInstance: IRelationshipType;

    beforeEach(async (done) => {

        try {

            existingInstanceNoEndDate = await RelationshipTypeModel.create({
                code: 'BUSINESS_REPRESENTATIVE',
                shortDecodeText: 'Business Representative',
                longDecodeText: 'Business Representative',
                startDate: new Date()
            });

            existingInstanceFutureEndDate = await RelationshipTypeModel.create({
                code: 'ONLINE_SERVICE_PROVIDER',
                shortDecodeText: 'Online Service Provider',
                longDecodeText: 'Online Service Provider',
                startDate: new Date(),
                endDate: new Date(2099, 1, 1)
            });

            existingExpiredInstance = await RelationshipTypeModel.create({
                code: 'INSOLVENCY_PRACTITIONER',
                shortDecodeText: 'Insolvency practitioner',
                longDecodeText: 'Insolvency practitioner',
                startDate: new Date(2016, 1, 1),
                endDate: new Date(2016, 1, 2)
            });

            done();

        } catch (e) {
            fail(e);
        }

    });

    it('find valid with no end date by code', async (done) => {
        try {
            const instance = await RelationshipTypeModel.findValidByCode(existingInstanceNoEndDate.code);
            expect(instance).not.toBeNull();
            done();
        } catch (e) {
            fail(e);
        }
    });

    it('find valid with future end date by code', async (done) => {
        try {
            const instance = await RelationshipTypeModel.findValidByCode(existingInstanceFutureEndDate.code);
            expect(instance).not.toBeNull();
            done();
        } catch (e) {
            fail(e);
        }
    });

    it('fails find valid by non-existent code', async (done) => {

        try {
            const code = '__BOGUS__';
            const instance = await RelationshipTypeModel.findValidByCode(code);
            expect(instance).toBeNull();
            done();
        } catch (e) {
            fail(e);
        }

    });

    it('fails find invalid by code', async (done) => {
        try {
            const instance = await RelationshipTypeModel.findValidByCode(existingExpiredInstance.code);
            expect(instance).toBeNull();
            done();
        } catch (e) {
            fail(e);
        }
    });

    it('list valid', async (done) => {
        try {
            const instances = await RelationshipTypeModel.listValid();
            expect(instances).not.toBeNull();
            expect(instances.length).toBeGreaterThan(0);
            for (let i = 0; i < instances.length; i += 1) {
                var instance = instances[i];
                expect(instance.startDate.valueOf()).toBeLessThan(new Date().valueOf());
                if (instance.endDate) {
                    expect(instance.endDate.valueOf()).toBeGreaterThan(new Date().valueOf());
                }
            }
            done();
        } catch (e) {
            fail(e);
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
            fail(e);
        }

    });

    it('fails inserts with empty code', async (done) => {
        try {
            await RelationshipTypeModel.create({
                shortDecodeText: 'Some short decode text',
                longDecodeText: 'Some long decode text',
                startDate: new Date()
            });
            fail("should not have inserted with empty code");
        } catch (e) {
            expect(e.name).toBe('ValidationError');
            done();
        }
    });

    it('fails inserts with duplicate code', async (done) => {

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

            fail("should not have inserted with duplicate code");

        } catch (e) {
            expect(e.name).toBe('ValidationError');
            expect(e.errors.code.message).toContain('unique');
            done();
        }

    });

});