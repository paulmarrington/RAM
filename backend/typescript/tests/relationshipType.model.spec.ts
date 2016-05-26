import {connectDisconnectMongo} from './helpers';
import {IRelationshipType, RelationshipTypeModel, relationshipTypes} from '../models/relationshipType.model';

/* tslint:disable:max-func-body-length */
describe('RAM Relationship Type', () => {

    connectDisconnectMongo();

    let existingInstance: IRelationshipType;
    let existingDeletedInstance: IRelationshipType;

    beforeEach(async (done) => {
        try {
            existingInstance = await RelationshipTypeModel.create({
                name: relationshipTypes[0]
            });

            existingDeletedInstance = await RelationshipTypeModel.create({
                name: relationshipTypes[0], deleteInd: true
            });
        } catch (e) {
            fail(e);
        }

        done();

    });

    it('find valid by id', async (done) => {
        try {
            const instance = await RelationshipTypeModel.findValidById(existingInstance.id);
            expect(instance).not.toBeNull();
            done();
        } catch (e) {
            fail(e);
        }
    });

    it('fails find valid by non-existent id', async (done) => {

        try {
            const id = '111111111111111111111111';
            const instance = await RelationshipTypeModel.findValidById(id);
            expect(instance).toBeNull();
            done();
        } catch (e) {
            fail(e);
        }

    });

    it('fails find invalid by id', async (done) => {
        try {
            const instance = await RelationshipTypeModel.findValidById(existingDeletedInstance.id);
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
                expect(instances[i].deleteInd).toBeFalsy();
            }
            done();
        } catch (e) {
            fail(e);
        }
    });

    it('inserts with valid type', async (done) => {
        try {

            const instance = await RelationshipTypeModel.create({ name: relationshipTypes[0] });

            expect(instance).not.toBeNull();
            expect(instance.id).not.toBeNull();
            expect(instance.name).not.toBeNull();
            expect(instance.createdAt).not.toBeNull();
            expect(instance.updatedAt).not.toBeNull();

            const retrievedInstance = await RelationshipTypeModel.findValidById(instance.id);
            expect(retrievedInstance).not.toBeNull();
            expect(retrievedInstance.id).toBe(instance.id);

            done();

        } catch (e) {
            fail(e);
        }

    });

    it('fails inserts with invalid type', async (done) => {
        try {
            await RelationshipTypeModel.create({ type: '__BOGUS__' });
            fail();
        } catch (e) {
            expect(e.name).toBe('ValidationError');
            done();
        }
    });

    it('deletes logically', async (done) => {

        try {

            const retrievedInstance = await RelationshipTypeModel.findValidById(existingInstance.id);
            expect(retrievedInstance).not.toBeNull();
            expect(retrievedInstance.id).toBe(existingInstance.id);

            await existingInstance.delete();

            const retrievedInstance2 = await RelationshipTypeModel.findValidById(existingInstance.id);
            expect(retrievedInstance2).toBeNull();

            done();

        } catch (e) {
            fail(e);
        }

    });

});