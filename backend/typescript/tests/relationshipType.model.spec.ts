import * as mongoose from 'mongoose';
import {connectDisconnectMongo} from './helpers';
import {RelationshipTypeModel, relationshipTypes} from '../models/relationshipType.model';

describe('RAM Relationship Type', () => {

    connectDisconnectMongo();

    it('Should Insert', async (done) => {

        const model = new RelationshipTypeModel();
        model.type = relationshipTypes[0];
        await model.save();

        expect(model).not.toBe(null);
        expect(model.id).not.toBe(null);
        expect(model.type).not.toBe(null);
        expect(model.createdAt).not.toBe(null);
        expect(model.updatedAt).not.toBe(null);

        const modelId = new mongoose.Types.ObjectId(model.id);
        const retrievedModel = await RelationshipTypeModel.findByObjectId(modelId);
        expect(retrievedModel).not.toBe(null);
        expect(retrievedModel.id).toBe(model.id);

        done();

    });

    it('Should Not Insert', async (done) => {

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

});