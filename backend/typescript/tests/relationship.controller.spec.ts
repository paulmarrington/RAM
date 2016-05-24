import * as mongoose from 'mongoose';
import {RelationshipModel} from '..//models/relationship.model';

describe('RAM Relationship', () => {
    beforeEach((done) => {
        console.log('\nConnecting to mongo');
        mongoose.connect('mongodb://localhost/ram', (err) => {
            if (err) {
                console.log('Unable to connect: ', err);
            } else {
                console.log('Connected!');
                done();
            }
        });
    });

    it('SPIKE MONGO', async (done) => {
        console.log('ROCK AND ROLL!');
        try {
            const relationshipType = await RelationshipModel.getRelationshipById(new mongoose.Types.ObjectId('5743cfe831286f0250b87da6'));
            console.log('relationshipType = ', relationshipType);
            done();
        } catch (e) {
            console.log('Unable to retrieve relationship type = ' + e);
            done();
        }
    });
});