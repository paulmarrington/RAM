import * as mongoose from 'mongoose';
import {conf} from '../bootstrap';

console.log('\nUsing mongo: ', conf.mongoURL, '\n');

export const connectDisconnectMongo = () => {

    beforeEach((done) => {
        mongoose.connect(conf.mongoURL, {}, done);
    });

    afterEach((done) => {
        // mongoose.disconnect().then(done); // TODO: disconnect(fn) doesn't work !
        mongoose.connection.close(done);
    });

};

export const dropMongo = () => {
    beforeEach((done) => {
        mongoose.connection.db.dropDatabase(done);
    });
};
