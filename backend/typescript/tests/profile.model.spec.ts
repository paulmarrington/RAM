import {connectDisconnectMongo, dropMongo} from './helpers';
import {
    ISharedSecret,
    SharedSecretModel} from '../models/sharedSecret.model';
import {
    ISharedSecretType,
    SharedSecretTypeModel} from '../models/sharedSecretType.model';
import {
    IName,
    NameModel} from '../models/name.model';
import {
    IProfile,
    ProfileModel,
    ProfileProvider} from '../models/profile.model';
import {
    IIdentity,
    IdentityModel,
    IdentityType} from '../models/identity.model';

/* tslint:disable:max-func-body-length */
describe('RAM Profile', () => {

    connectDisconnectMongo();
    dropMongo();

    let sharedSecretType1: ISharedSecretType;
    let sharedSecretTypeCode1 = 'SHARED_SECRET_TYPE_1';
    let sharedSecret1: ISharedSecret;
    let sharedSecretValue1 = 'secret_value_1';
    let name1: IName;
    let profile1: IProfile;
    let identity1: IIdentity;

    beforeEach(async (done) => {

        try {

            sharedSecretType1 = await SharedSecretTypeModel.create({
                code: sharedSecretTypeCode1,
                shortDecodeText: 'Shared Secret',
                longDecodeText: 'Shared Secret',
                startDate: new Date(),
                domain: 'domain'
            });
            sharedSecret1 = await SharedSecretModel.create({
                value: sharedSecretValue1,
                sharedSecretType: sharedSecretType1
            });

            name1 = await NameModel.create({
                givenName: 'John',
                familyName: 'Smith',
                unstructuredName: 'John Smith'
            });

            profile1 = await ProfileModel.create({
                provider: ProfileProvider.MyGov.name,
                name: name1,
                sharedSecrets: [sharedSecret1]
            });

            identity1 = await IdentityModel.create({
                idValue: 'uuid_1',
                identityType: IdentityType.LinkId.name,
                defaultInd: false,
                profile: profile1
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

    it('converts provider to enum', async (done) => {
        try {
            expect(profile1).not.toBeNull();
            expect(profile1.provider).toBe(ProfileProvider.MyGov.name);
            expect(profile1.providerEnum()).toBe(ProfileProvider.MyGov);
            done();
        } catch (e) {
            fail('Because ' + e);
            done();
        }
    });

    it('get shared secret by code', async (done) => {
        try {
            expect(profile1.getSharedSecret(sharedSecretTypeCode1).sharedSecretType.code).toBe(sharedSecretTypeCode1);
            done();
        } catch (e) {
            fail('Because ' + e);
            done();
        }
    });

    it('fails get shared secret by non-existent code', async (done) => {
        try {
            expect(profile1.getSharedSecret('__BOGUS__')).toBeNull();
            done();
        } catch (e) {
            fail('Because ' + e);
            done();
        }
    });

});