import {connectDisconnectMongo, dropMongo} from './helpers';
import {
    IIdentity,
    IdentityModel,
    IdentityType} from '../models/identity.model';
import {
    IProfile,
    ProfileModel,
    ProfileProvider} from '../models/profile.model';
import {
    IName,
    NameModel} from '../models/name.model';

/* tslint:disable:max-func-body-length */
describe('RAM Identity', () => {

    connectDisconnectMongo();
    dropMongo();

    let name1: IName;
    let profile1: IProfile;
    let identity1: IIdentity;

    beforeEach(async (done) => {

        try {

            name1 = await NameModel.create({
                givenName: 'John',
                familyName: 'Smith',
                unstructuredName: 'John Smith'
            });

            profile1 = await ProfileModel.create({
                provider: ProfileProvider.MyGov.name,
                name: name1
            });

            identity1 = await IdentityModel.create({
                idValue: 'uuid_1',
                identityType: IdentityType.LinkId.name,
                defaultInd: false,
                token: 'token_1',
                scheme: 'scheme_1',
                consumer: 'consumer_1',
                profile: profile1
            });

            done();

        } catch (e) {
            fail('Because ' + e);
            done();
        }

    });

    it('finds identity by id value', async (done) => {
        try {
            const instance = await IdentityModel.findByIdValueAndType(identity1.idValue, IdentityType.valueOf(identity1.identityType));
            expect(instance).not.toBeNull();
            done();
        } catch (e) {
            fail('Because ' + e);
            done();
        }
    });

    it('inserts with valid values', async (done) => {
        try {

            const idValue = 'uuid_x';
            const type = IdentityType.LinkId;
            const defaultInd = false;
            const token = 'token_x';
            const scheme = 'scheme_x';
            const consumer = 'consumer_x';

            const instance = await IdentityModel.create({
                idValue: idValue,
                identityType: type.name,
                defaultInd: defaultInd,
                token: token,
                scheme: scheme,
                consumer: consumer,
                profile: profile1
            });

            expect(instance).not.toBeNull();
            expect(instance.id).not.toBeNull();
            expect(instance.idValue).not.toBeNull();
            expect(instance.identityType).not.toBeNull();
            expect(instance.scheme).not.toBeNull();
            expect(instance.consumer).not.toBeNull();
            expect(instance.profile).not.toBeNull();
            expect(instance.profile.name).not.toBeNull();

            const retrievedInstance = await IdentityModel.findByIdValueAndType(idValue, type);
            expect(retrievedInstance).not.toBeNull();
            expect(retrievedInstance.id).toBe(instance.id);
            expect(retrievedInstance.identityType).toBe(type.name);
            expect(retrievedInstance.identityTypeEnum()).toBe(type);
            expect(retrievedInstance.defaultInd).toBe(defaultInd);
            expect(retrievedInstance.token).toBe(token);
            expect(retrievedInstance.scheme).toBe(scheme);
            expect(retrievedInstance.consumer).toBe(consumer);
            expect(retrievedInstance.profile.id).toBe(profile1.id);
            expect(retrievedInstance.profile.name.id).toBe(name1.id);

            done();

        } catch (e) {
            fail('Because ' + e);
            done();
        }
    });

    it('fails insert with invalid type', async (done) => {
        try {
            await IdentityModel.create({
                idValue: 'uuid_x',
                identityType: '__BOGUS__',
                defaultInd: false,
                token: 'token_x',
                scheme: 'scheme_x',
                consumer: 'scheme_x',
                profile: profile1
            });
            fail('should not have inserted with invalid type');
            done();
        } catch (e) {
            expect(e.name).toBe('ValidationError');
            expect(e.errors.type).not.toBeNull();
            done();
        }
    });

    it('fails insert with null type', async (done) => {
        try {
            await IdentityModel.create({
                idValue: 'uuid_x',
                defaultInd: false,
                token: 'token_x',
                scheme: 'scheme_x',
                consumer: 'scheme_x',
                profile: profile1
            });
            fail('should not have inserted with null type');
            done();
        } catch (e) {
            expect(e.name).toBe('ValidationError');
            expect(e.errors.type).not.toBeNull();
            done();
        }
    });

    it('fails insert with null profile', async (done) => {
        try {
            await IdentityModel.create({
                idValue: 'uuid_x',
                identityType: IdentityType.LinkId.name,
                defaultInd: false,
                token: 'token_x',
                scheme: 'scheme_x',
                consumer: 'scheme_x'
            });
            fail('should not have inserted with null profile');
            done();
        } catch (e) {
            expect(e.name).toBe('ValidationError');
            expect(e.errors.profile).not.toBeNull();
            done();
        }
    });

});