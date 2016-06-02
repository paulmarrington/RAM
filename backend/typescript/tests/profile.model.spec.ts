import {connectDisconnectMongo, dropMongo} from './helpers';
import {
    IProfile,
    ProfileModel,
    ProfileProvider} from '../models/profile.model';
import {
    IName,
    NameModel} from '../models/name.model';

/* tslint:disable:max-func-body-length */
describe('RAM Profile', () => {

    connectDisconnectMongo();
    dropMongo();

    let name1: IName;

    beforeEach(async (done) => {

        try {

            name1 = await NameModel.create({
                givenName: 'John',
                familyName: 'Smith',
                unstructuredName: 'John Smith'
            });

            done();

        } catch (e) {
            fail('Because ' + e);
            done();
        }

    });

    it('inserts with valid values', async (done) => {
        try {

            const provider = ProfileProvider.MyGov;

            const instance = await ProfileModel.create({
                provider: provider.name,
                name: name1
            });

            expect(instance).not.toBeNull();
            expect(instance.id).not.toBeNull();
            expect(instance.provider).not.toBeNull();
            expect(instance.name).not.toBeNull();

            done();

        } catch (e) {
            fail('Because ' + e);
            done();
        }
    });

    it('fails insert with invalid provider', async (done) => {
        try {
            await ProfileModel.create({
                provider: '__BOGUS__',
                name: name1
            });
            fail('should not have inserted with invalid provider');
            done();
        } catch (e) {
            expect(e.name).toBe('ValidationError');
            expect(e.errors.provider).not.toBeNull();
            done();
        }
    });

    it('fails insert with invalid provider', async (done) => {
        try {
            await ProfileModel.create({
                name: name1
            });
            fail('should not have inserted with null provider');
            done();
        } catch (e) {
            expect(e.name).toBe('ValidationError');
            expect(e.errors.provider).not.toBeNull();
            done();
        }
    });

    it('fails insert with null name', async (done) => {
        try {
            await ProfileModel.create({
                provider: ProfileProvider.MyGov.name
            });
            fail('should not have inserted with null name');
            done();
        } catch (e) {
            expect(e.name).toBe('ValidationError');
            expect(e.errors.name).not.toBeNull();
            done();
        }
    });

});