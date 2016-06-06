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
describe('RAM Shared Secret', () => {

    connectDisconnectMongo();
    dropMongo();

    let sharedSecretTypeNoEndDate: ISharedSecretType;
    let sharedSecretTypeFutureEndDate: ISharedSecretType;
    let sharedSecretTypeExpiredEndDate: ISharedSecretType;

    let sharedSecretNoEndDate: ISharedSecret;
    let sharedSecretValue1 = 'secret_value_1';
    let name1: IName;
    let profile1: IProfile;
    let identity1: IIdentity;

    beforeEach(async (done) => {

        try {

            sharedSecretTypeNoEndDate = await SharedSecretTypeModel.create({
                code: 'SHARED_SECRET_TYPE_1',
                shortDecodeText: 'Shared Secret',
                longDecodeText: 'Shared Secret',
                startDate: new Date(),
                domain: 'domain'
            });

            sharedSecretTypeFutureEndDate = await SharedSecretTypeModel.create({
                code: 'SHARED_SECRET_TYPE_2',
                shortDecodeText: 'Shared Secret',
                longDecodeText: 'Shared Secret',
                startDate: new Date(),
                endDate: new Date(2099, 1, 1),
                domain: 'domain'
            });

            sharedSecretTypeExpiredEndDate = await SharedSecretTypeModel.create({
                code: 'SHARED_SECRET_TYPE_3',
                shortDecodeText: 'Shared Secret',
                longDecodeText: 'Shared Secret',
                startDate: new Date(2016, 1, 1),
                endDate: new Date(2016, 1, 2),
                domain: 'domain'
            });

            sharedSecretNoEndDate = await SharedSecretModel.create({
                value: sharedSecretValue1,
                sharedSecretType: sharedSecretTypeNoEndDate
            });

            name1 = await NameModel.create({
                givenName: 'John',
                familyName: 'Smith',
                unstructuredName: 'John Smith'
            });

            profile1 = await ProfileModel.create({
                provider: ProfileProvider.MyGov.name,
                name: name1,
                sharedSecrets: [sharedSecretNoEndDate]
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

    it('finds identity includes profile and shared secrets', async (done) => {
        try {
            const instance = await IdentityModel.findByIdValueAndType(identity1.idValue, IdentityType.valueOf(identity1.identityType));
            expect(instance).not.toBeNull();
            expect(instance.id).toBe(identity1.id);
            expect(instance.profile.id).toBe(profile1.id);
            expect(instance.profile.sharedSecrets.length).toBe(1);
            expect(instance.profile.sharedSecrets[0].sharedSecretType.code).toBe(sharedSecretNoEndDate.sharedSecretType.code);
            done();
        } catch (e) {
            fail('Because ' + e);
            done();
        }
    });

    it('hashes value upon insert', async (done) => {
        try {
            const instance = await IdentityModel.findByIdValueAndType(identity1.idValue, IdentityType.valueOf(identity1.identityType));
            expect(instance).not.toBeNull();
            expect(instance.profile.sharedSecrets[0].value).not.toBeNull();
            expect(instance.profile.sharedSecrets[0].value).toBe(sharedSecretNoEndDate.value);
            expect(instance.profile.sharedSecrets[0].value).not.toBe(sharedSecretValue1);
            expect(instance.profile.sharedSecrets[0].matchesValue(sharedSecretValue1)).toBe(true);
            expect(instance.profile.sharedSecrets[0].matchesValue('__BOGUS__')).toBe(false);
            done();
        } catch (e) {
            fail('Because ' + e);
            done();
        }
    });

    it('hashes value upon update', async (done) => {
        try {
            let sharedSecretValue2 = 'secret_value_2';
            let instance = await IdentityModel.findByIdValueAndType(identity1.idValue, IdentityType.valueOf(identity1.identityType));
            sharedSecretNoEndDate.value = sharedSecretValue2;
            await sharedSecretNoEndDate.save();
            instance = await IdentityModel.findByIdValueAndType(identity1.idValue, IdentityType.valueOf(identity1.identityType));
            expect(instance).not.toBeNull();
            expect(instance.profile.sharedSecrets[0].value).not.toBeNull();
            expect(instance.profile.sharedSecrets[0].value).toBe(sharedSecretNoEndDate.value);
            expect(instance.profile.sharedSecrets[0].value).not.toBe(sharedSecretValue2);
            expect(instance.profile.sharedSecrets[0].matchesValue(sharedSecretValue1)).toBe(false);
            expect(instance.profile.sharedSecrets[0].matchesValue(sharedSecretValue2)).toBe(true);
            expect(instance.profile.sharedSecrets[0].matchesValue('__BOGUS__')).toBe(false);
            done();
        } catch (e) {
            fail('Because ' + e);
            done();
        }
    });

    it('matches value', async (done) => {
        try {
            expect(sharedSecretNoEndDate.matchesValue(sharedSecretValue1)).toBe(true);
            done();
        } catch (e) {
            fail('Because ' + e);
            done();
        }
    });

    it('does not match null value', async (done) => {
        try {
            expect(sharedSecretNoEndDate.matchesValue(null)).toBe(false);
            done();
        } catch (e) {
            fail('Because ' + e);
            done();
        }
    });

});