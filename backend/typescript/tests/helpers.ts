import * as mongoose from 'mongoose';
import {conf} from '../bootstrap';
import {_resetDataInMongo} from '../resetDataInMongo';

console.log('\nUsing mongo: ', conf.mongoURL, '\n');

export const connectDisconnectMongo = () => {

    beforeEach((done) => {
        mongoose.connect(conf.mongoURL, {}, done);
    });

    afterEach((done) => {
        mongoose.connection.close(done);
    });

};

/* tslint:disable:max-func-body-length */
export const resetDataInMongo = () => {
    beforeEach((done) => {
        _resetDataInMongo(done);
    });
};
