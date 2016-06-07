import * as mongoose from 'mongoose';
import {connectDisconnectMongo} from './helpers';
import {RelationshipModel} from '../models/relationship-old.model';

describe('RAM Relationship', () => {

    connectDisconnectMongo();

    // todo replace this with something meaningful
    xit('spikes mongo connectivity', async (done) => {
        try {
            const objectId = new mongoose.Types.ObjectId('5743cfe831286f0250b87da6');
            await RelationshipModel.getRelationshipById(objectId);
            done();
        } catch (e) {
            fail();
        }
    });

});