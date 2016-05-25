import * as mongoose from 'mongoose';

const mongoDbUrl = 'mongodb://localhost/ram-test';
console.log('\nUsing mongo: ', mongoDbUrl, '\n');

export function connectDisconnectMongo() {

    beforeEach((done) => {
        mongoose.connect(mongoDbUrl).then(() => {
            //console.log('\nConnected to db');
            done();
        });
    });

    afterEach((done) => {
        mongoose.disconnect().then(() => {
            //console.log('Disconnected from db');
            done();
        });
    });

}

export function dropMongo() {

    afterEach((done) => {
        mongoose.connection.db.dropDatabase().then(() => {
            //console.log('Dropped db');
            done();
        })
    });

}
