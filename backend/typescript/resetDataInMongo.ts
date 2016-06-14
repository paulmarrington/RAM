import * as mongoose from 'mongoose';
import * as mongooseAutoIncrement from 'mongoose-auto-increment';

/* tslint:disable:max-func-body-length */
export const _resetDataInMongo = (done?:() => void) => {
    mongooseAutoIncrement.initialize(mongoose.connection);
    mongoose.connection.db.listCollections().toArray((err:Error, collectionNames:[{name:string}]) => {
        const promises = collectionNames.map(function (collectionName) {
            return new Promise<string>(function (resolve, reject) {
                try {
                    const name = collectionName.name;
                    if (name.indexOf('.') === -1) {
                        if (name.toLowerCase() !== 'identitycounters') {
                            mongoose.connection.db.dropCollection(name, (err:Error) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve(name);
                                }
                            });
                        } else {
                            mongoose.model('IdentityCounter').update(
                                {count: 1},
                                (err:Error, raw:Object) => {
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
                if (done) {
                    done();
                }
            })
            .catch((err:Error) => {
                console.log('\nUnable to drop mongo:', err);
                if (done) {
                    done();
                }
            });
    });
};
