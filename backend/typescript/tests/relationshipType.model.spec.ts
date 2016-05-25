import * as mongoose from 'mongoose';
import {connectDisconnectMongo} from './helpers';
import {RelationshipTypeModel, relationshipTypes} from '../models/relationshipType.model';

describe('RAM Relationship Type', () => {

    connectDisconnectMongo();

    var existingValidModel;
    var existingDeletedModel;

    beforeEach(async (done) => {

        existingValidModel = new RelationshipTypeModel();
        existingValidModel.type = relationshipTypes[0];
        await existingValidModel.save();

        existingDeletedModel = new RelationshipTypeModel();
        existingDeletedModel.type = relationshipTypes[0];
        existingDeletedModel.deleteInd = true;
        await existingDeletedModel.save();

        done();

    });

    it('find valid by id', async (done) => {

        try {

            const model = await RelationshipTypeModel.findValidById(existingValidModel.id);
            expect(model).not.toBeNull();
            done();

        } catch (e) {
            fail(e);
        }

    });

    it('fails find valid by non-existent id', async (done) => {

        try {

            const id = '111111111111111111111111';
            const model = await RelationshipTypeModel.findValidById(id);
            expect(model).toBeNull();
            done();

        } catch (e) {
            fail(e);
        }

    });

    it('fails find invalid by id', async (done) => {

        try {

            const model = await RelationshipTypeModel.findValidById(existingDeletedModel.id);
            expect(model).toBeNull();
            done();

        } catch (e) {
            fail(e);
        }

    });

    it('inserts with valid type', async (done) => {

        try {

            const model = new RelationshipTypeModel();
            model.type = relationshipTypes[0];
            await model.save();

            expect(model).not.toBeNull();
            expect(model.id).not.toBeNull();
            expect(model.type).not.toBeNull();
            expect(model.createdAt).not.toBeNull();
            expect(model.updatedAt).not.toBeNull();

            const retrievedModel = await RelationshipTypeModel.findValidById(model.id);
            expect(retrievedModel).not.toBeNull();
            expect(retrievedModel.id).toBe(model.id);

            done();

        } catch (e) {
            fail(e)
        }

    });

    it('fails inserts with invalid type', async (done) => {

        try {

            const model = new RelationshipTypeModel();
            model.type = '__BOGUS__';
            await model.save();
            fail();

        } catch (e) {
            expect(e.name).toBe('ValidationError');
            done();
        }

    });

    it('deletes logically', async (done) => {

        try {

            const retrievedModel = await RelationshipTypeModel.findValidById(existingValidModel.id);
            expect(retrievedModel).not.toBeNull();
            expect(retrievedModel.id).toBe(existingValidModel.id);

            await existingValidModel.delete();

            const retrievedModel2 = await RelationshipTypeModel.findValidById(existingValidModel.id);
            expect(retrievedModel2).toBeNull();

            done();

        } catch (e) {
            fail(e);
        }

    });


});