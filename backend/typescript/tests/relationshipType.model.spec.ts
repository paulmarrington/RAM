import {connectDisconnectMongo} from './helpers';
import {IRelationshipTypeModel,IRelationshipType,RelationshipTypeModel,relationshipTypes} from '../models/relationshipType.model';

/* tslint:disable:max-func-body-length */
describe('RAM Relationship Type', () => {

    connectDisconnectMongo();

    let relTypeModel:IRelationshipTypeModel = RelationshipTypeModel;

    let existingInstance:IRelationshipType;
    let existingDeletedInstance:IRelationshipType;

    beforeEach(async (done) => {

        //existingInstance = await relTypeModel.create({type: relationshipTypes[0]});
        //console.log(existingInstance);
        //existingDeletedInstance = await relTypeModel.create({ type: relationshipTypes[0], deleteInd: true});
        //console.log(existingDeletedInstance);

        existingInstance = new RelationshipTypeModel();
        existingInstance.name = relationshipTypes[0];
        await existingInstance.save();

        existingDeletedInstance = new RelationshipTypeModel();
        existingDeletedInstance.name = relationshipTypes[1];
        existingDeletedInstance.deleteInd = true;
        await existingDeletedInstance.save();

        done();

    });

    it('find valid by id', async (done) => {
        try {
            const instance = await relTypeModel.findValidById(existingInstance.id);
            expect(instance).not.toBeNull();
            done();
        } catch (e) {
            fail(e);
        }
    });

    it('fails find valid by non-existent id', async (done) => {

        try {
            const id = '111111111111111111111111';
            const instance = await relTypeModel.findValidById(id);
            expect(instance).toBeNull();
            done();
        } catch (e) {
            fail(e);
        }

    });

    it('fails find invalid by id', async (done) => {
        try {
            const instance = await relTypeModel.findValidById(existingDeletedInstance.id);
            expect(instance).toBeNull();
            done();
        } catch (e) {
            fail(e);
        }
    });

    it('list valid', async (done) => {
        try {
            const instances = await relTypeModel.listValid();
            expect(instances).not.toBeNull();
            expect(instances.length).toBeGreaterThan(0);
            for (var instance in instances) {
                expect(instances.deleteInd).toBeFalsy();
            }
            done();
        } catch (e) {
            fail(e);
        }
    });

    it('inserts with valid type', async (done) => {

        try {

            const instance = await relTypeModel.create({name: relationshipTypes[0]});

            expect(instance).not.toBeNull();
            expect(instance.id).not.toBeNull();
            expect(instance.name).not.toBeNull();
            expect(instance.createdAt).not.toBeNull();
            expect(instance.updatedAt).not.toBeNull();

            const retrievedInstance = await relTypeModel.findValidById(instance.id);
            expect(retrievedInstance).not.toBeNull();
            expect(retrievedInstance.id).toBe(instance.id);

            done();

        } catch (e) {
            fail(e);
        }

    });

    it('fails inserts with invalid type', async (done) => {
        try {
            await relTypeModel.create({type: '__BOGUS__'});
            fail();
        } catch (e) {
            expect(e.name).toBe('ValidationError');
            done();
        }
    });

    it('deletes logically', async (done) => {

        try {

            const retrievedInstance = await relTypeModel.findValidById(existingInstance.id);
            expect(retrievedInstance).not.toBeNull();
            expect(retrievedInstance.id).toBe(existingInstance.id);

            await existingInstance.delete();

            const retrievedInstance2 = await relTypeModel.findValidById(existingInstance.id);
            expect(retrievedInstance2).toBeNull();

            done();

        } catch (e) {
            fail(e);
        }

    });

});