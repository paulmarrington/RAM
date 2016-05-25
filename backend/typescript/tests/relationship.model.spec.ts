import * as mongoose from 'mongoose';
import {connectDisconnectMongo} from './helpers';
import {RelationshipModel} from '../models/relationship.model';

describe('RAM Relationship', () => {

    connectDisconnectMongo();

    // todo replace this with something meaningful
    it('SPIKE MONGO', async (done) => {
        try {
            const objectId = new mongoose.Types.ObjectId('5743cfe831286f0250b87da6');
            const relationship = await RelationshipModel.getRelationshipById(objectId);
            console.log('relationship = ', relationship);
            done();
        } catch (e) {
            console.log('Unable to retrieve relationship = ' + e);
            done();
        }
    });

});