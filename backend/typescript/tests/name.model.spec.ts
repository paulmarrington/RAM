import {connectDisconnectMongo, dropMongo} from './helpers';
import {NameModel} from '../models/name.model';

/* tslint:disable:max-func-body-length */
describe('RAM Name', () => {

    connectDisconnectMongo();
    dropMongo();

    beforeEach(async (done) => {
        done();
    });

    it('inserts with given name', async (done) => {
        try {
            await NameModel.create({
                givenName: 'John'
            });
            done();
        } catch (e) {
            fail('Because ' + e);
            done();
        }
    });

    it('inserts with given and family names', async (done) => {
        try {
            await NameModel.create({
                givenName: 'John',
                familyName: 'Smith'
            });
            done();
        } catch (e) {
            fail('Because ' + e);
            done();
        }
    });

    it('inserts with unstructured name', async (done) => {
        try {
            await NameModel.create({
                unstructuredName: 'John\'s Catering Pty Ltd'
            });
            done();
        } catch (e) {
            fail('Because ' + e);
            done();
        }
    });

    it('fails insert with empty fields', async (done) => {
        try {
            await NameModel.create({
            });
            fail('should not have inserted with empty fields');
            done();
        } catch (e) {
            expect(e.name).toBe('ValidationError');
            expect(e.errors.givenName).not.toBeNull();
            expect(e.errors.unstructuredName).not.toBeNull();
            done();
        }
    });

    it('fails insert with given name and unstructured name', async (done) => {
        try {
            await NameModel.create({
                givenName: 'John',
                unstructuredName: 'John\'s Catering Pty Ltd'
            });
            fail('should not have inserted with empty fields');
            done();
        } catch (e) {
            expect(e.name).toBe('ValidationError');
            expect(e.errors.givenName).not.toBeNull();
            expect(e.errors.unstructuredName).not.toBeNull();
            done();
        }
    });

    it('fails insert with family name and unstructured name', async (done) => {
        try {
            await NameModel.create({
                familyName: 'Smith',
                unstructuredName: 'John\'s Catering Pty Ltd'
            });
            fail('should not have inserted with empty fields');
            done();
        } catch (e) {
            expect(e.name).toBe('ValidationError');
            expect(e.errors.givenName).not.toBeNull();
            expect(e.errors.unstructuredName).not.toBeNull();
            done();
        }
    });

    it('fails insert with given name, family name and unstructured name', async (done) => {
        try {
            await NameModel.create({
                givenName: 'John',
                familyName: 'Smith',
                unstructuredName: 'John\'s Catering Pty Ltd'
            });
            fail('should not have inserted with empty fields');
            done();
        } catch (e) {
            expect(e.name).toBe('ValidationError');
            expect(e.errors.givenName).not.toBeNull();
            expect(e.errors.unstructuredName).not.toBeNull();
            done();
        }
    });

});