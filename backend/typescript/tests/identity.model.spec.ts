import {connectDisconnectMongo, dropMongo} from './helpers';
import {
    IIdentity,
    IdentityModel,
    IdentityType} from '../models/Identity.model';

/* tslint:disable:max-func-body-length */
describe('RAM Identity', () => {

    connectDisconnectMongo();
    dropMongo();

    let identity1: IIdentity;

    beforeEach(async (done) => {

        try {

            identity1 = await IdentityModel.create({
                idValue: 'uuid_1',
                identityType: IdentityType.LinkId.name,
                defaultInd: false
            });

            done();

        } catch (e) {
            fail('Because ' + e);
            done();
        }

    });

    it('find identity by id value', async (done) => {
        try {
            const instance = await IdentityModel.findByIdValueAndType(identity1.idValue, IdentityType.valueOf(identity1.identityType));
            expect(instance).not.toBeNull();
            done();
        } catch (e) {
            fail('Because ' + e);
            done();
        }
    });

    it('inserts with valid type', async (done) => {
        try {

            const idValue = 'uuid_x';
            const type = IdentityType.LinkId;

            const instance = await IdentityModel.create({
                idValue: idValue,
                identityType: type.name,
                defaultInd: false
            });

            expect(instance).not.toBeNull();
            expect(instance.id).not.toBeNull();
            expect(instance.idValue).not.toBeNull();
            expect(instance.identityType).not.toBeNull();

            const retrievedInstance = await IdentityModel.findByIdValueAndType(idValue, type);
            expect(retrievedInstance).not.toBeNull();
            expect(retrievedInstance.id).toBe(instance.id);
            expect(retrievedInstance.identityType).toBe(type.name);
            expect(retrievedInstance.identityTypeEnum()).toBe(type);

            done();

        } catch (e) {
            fail('Because ' + e);
            done();
        }
    });

    it('fails insert with invalid type', async (done) => {
        try {
            await IdentityModel.create({
                idValue: 'uuid_1',
                identityType: '__BOGUS__',
                defaultInd: false
            });
            fail('should not have inserted with invalid type');
            done();
        } catch (e) {
            expect(e.name).toBe('ValidationError');
            done();
        }
    });

});