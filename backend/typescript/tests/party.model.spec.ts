import {connectDisconnectMongo, dropMongo} from './helpers';
import {
    IIdentity,
    IdentityModel,
    IdentityType,
    IdentityInvitationCodeStatus,
    IdentityAgencyScheme,
    IdentityPublicIdentifierScheme,
    IdentityLinkIdScheme} from '../models/identity.model';
import {
    IName,
    NameModel} from '../models/name.model';
import {
    IProfile,
    ProfileModel,
    ProfileProvider} from '../models/profile.model';
import {
    IParty,
    PartyModel,
    PartyType} from '../models/party.model';

/* tslint:disable:max-func-body-length */
describe('RAM Identity', () => {

    connectDisconnectMongo();
    dropMongo();

    let name1: IName;
    let profile1: IProfile;
    let party1: IParty;
    let identity1: IIdentity;

    beforeEach(async (done) => {

        try {

            name1 = await NameModel.create({
                givenName: 'John',
                familyName: 'Smith'
            });

            profile1 = await ProfileModel.create({
                provider: ProfileProvider.MyGov.name,
                name: name1
            });

            party1 = await PartyModel.create({
                partyType: PartyType.Individual.name,
                name: name1
            });

            identity1 = await IdentityModel.create({
                rawIdValue: 'uuid_1',
                identityType: IdentityType.LinkId.name,
                defaultInd: false,
                linkIdScheme: IdentityLinkIdScheme.MyGov.name,
                profile: profile1,
                party: party1
            });

            done();

        } catch (e) {
            fail('Because ' + e);
            done();
        }

    });

    it('finds by identity id value', async (done) => {
        try {
            const instance = await PartyModel.findByIdentityIdValue(identity1.idValue);
            expect(instance).not.toBeNull();
            expect(instance.id).toBe(party1.id);
            expect(instance.partyType).not.toBeNull();
            done();
        } catch (e) {
            fail('Because ' + e);
            done();
        }
    });

});