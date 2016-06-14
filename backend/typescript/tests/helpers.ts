import * as mongoose from 'mongoose';
import * as mongooseAutoIncrement from 'mongoose-auto-increment';
import {conf} from '../bootstrap';

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
        mongooseAutoIncrement.initialize(mongoose.connection);
        mongoose.connection.db.listCollections().toArray((err:Error, collectionNames:[{name:string}]) => {
            const promises = collectionNames.map(function (collectionName) {
                return new Promise<string>(function (resolve, reject) {
                    try {
                        const name = collectionName.name;
                        if (name.indexOf('.') === -1) {
                            if (name !== 'identitycounters') {
                                mongoose.connection.db.dropCollection(name, (err:Error) => {
                                    if (err) {
                                        reject(err);
                                    } else {
                                        resolve(name);
                                    }
                                });
                            } else {
                                //resolve(name);
                                mongoose.model('identitycounters').update(
                                    {count: 1},
                                    (err, raw) => {
                                        if (err) {
                                            reject(err);
                                        } else {
                                            resolve(name);
                                        }
                                    }
                                );
                            }
                        } else {
                            resolve(name);
                        }
                    } catch (e) {
                        console.log('\nUnable to drop collection:', e);
                        reject(e);
                    }
                });
            });
            Promise.all(promises)
                .then(() => {
                    done();
                })
                .catch((err:Error) => {
                    console.log('\nUnable to drop mongo:', err);
                    done();
                });
        });
    });
};
