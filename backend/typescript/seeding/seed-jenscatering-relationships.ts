import {conf} from '../bootstrap';
import {Seeder} from './seed';
import {ProfileProvider} from '../models/profile.model';
import {PartyType} from '../models/party.model';
import {IdentityType, IdentityInvitationCodeStatus} from '../models/identity.model';
import {RelationshipStatus} from '../models/relationship.model';

// seeder .............................................................................................................

/* tslint:disable:no-any */
/* tslint:disable:max-func-body-length */
export class JensCateringRelationshipsSeeder {

    private static async load_jenniferMaxim_associate() {
        try {

            Seeder.log('\nInserting Sample Relationship - Jen\'s Catering Pty Ltd / Jennifer Maxim:\n'.underline);

            if (!conf.devMode) {

                Seeder.log('Skipped in prod mode'.gray);

            } else {

                Seeder.jpty_and_jm_relationship = await Seeder.createRelationshipModel({
                    relationshipType: Seeder.associate_delegate_relationshipType,
                    subject: Seeder.jenscatering_party,
                    subjectNickName: Seeder.jenscatering_name,
                    delegate: Seeder.jennifermaxims_party,
                    delegateNickName: Seeder.jennifermaxims_name,
                    startTimestamp: new Date(),
                    status: RelationshipStatus.Active.name,
                    attributes: [
                        await Seeder.createRelationshipAttributeModel({
                            value: true,
                            attributeName: Seeder.permissionCustomisationAllowedInd_attributeName
                        } as any),
                        await Seeder.createRelationshipAttributeModel({
                            value: true,
                            attributeName: Seeder.delegateManageAuthorisationAllowedInd_attributeName
                        } as any),
                        await Seeder.createRelationshipAttributeModel({
                            value: true,
                            attributeName: Seeder.delegateRelationshipTypeDeclaration_attributeName
                        } as any),
                        await Seeder.createRelationshipAttributeModel({
                            value: true,
                            attributeName: Seeder.subjectRelationshipTypeDeclaration_attributeName
                        } as any)
                    ]
                } as any);

                Seeder.log('');

            }

        } catch (e) {
            Seeder.log('Seeding failed!');
            Seeder.log(e);
        }
    }

    public static async load_robertsmith_invitationCode() {
        try {

            Seeder.log('\nInserting Sample Invitation Code - Jen\'s Catering Pty Ltd / Robert Smith:\n'.underline);

            if (!conf.devMode) {

                Seeder.log('Skipped in prod mode'.gray);

            } else {

                Seeder.robertsmith_name = await Seeder.createNameModel({
                    givenName: 'Robert',
                    familyName: 'Smith'
                } as any);

                Seeder.robertsmith_dob = await Seeder.createSharedSecretModel({
                    value: '01/01/2000',
                    sharedSecretType: Seeder.dob_sharedSecretType
                } as any);

                Seeder.robertsmith_profile = await Seeder.createProfileModel({
                    provider: ProfileProvider.MyGov.name,
                    name: Seeder.robertsmith_name,
                    sharedSecrets: [Seeder.robertsmith_dob]
                } as any);

                Seeder.robertsmith_party = await Seeder.createPartyModel({
                    partyType: PartyType.Individual.name
                } as any);

                Seeder.log('');

                Seeder.robertsmith_identity_1 = await Seeder.createIdentityModel({
                    identityType: IdentityType.InvitationCode.name,
                    defaultInd: true,
                    invitationCodeStatus: IdentityInvitationCodeStatus.Pending.name,
                    invitationCodeExpiryTimestamp: new Date(2055, 1, 1),
                    profile: Seeder.robertsmith_profile,
                    party: Seeder.robertsmith_party
                } as any);

                Seeder.log('');

                Seeder.jpty_and_rs_relationship = await Seeder.createRelationshipModel({
                    relationshipType: Seeder.custom_delegate_relationshipType,
                    subject: Seeder.jenscatering_party,
                    subjectNickName: Seeder.jenscatering_name,
                    delegate: Seeder.robertsmith_party,
                    delegateNickName: Seeder.robertsmith_name,
                    startTimestamp: new Date(),
                    status: RelationshipStatus.Pending.name,
                    attributes: [
                        await Seeder.createRelationshipAttributeModel({
                            value: true,
                            attributeName: Seeder.permissionCustomisationAllowedInd_attributeName
                        } as any),
                        await Seeder.createRelationshipAttributeModel({
                            value: true,
                            attributeName: Seeder.delegateManageAuthorisationAllowedInd_attributeName
                        } as any),
                        await Seeder.createRelationshipAttributeModel({
                            value: true,
                            attributeName: Seeder.delegateRelationshipTypeDeclaration_attributeName
                        } as any),
                        await Seeder.createRelationshipAttributeModel({
                            value: true,
                            attributeName: Seeder.subjectRelationshipTypeDeclaration_attributeName
                        } as any)
                    ]
                } as any);

            }

        } catch (e) {
            Seeder.log('Seeding failed!');
            Seeder.log(e);
        }
    }

    public static async load_fredjohnson_invitationCode() {
        try {

            Seeder.log('\nInserting Sample Invitation Code - Jen\'s Catering Pty Ltd / Fred Johnson:\n'.underline);

            if (!conf.devMode) {

                Seeder.log('Skipped in prod mode'.gray);

            } else {

                Seeder.fredjohnson_name = await Seeder.createNameModel({
                    givenName: 'Fred',
                    familyName: 'Johnson'
                } as any);

                Seeder.fredjohnson_dob = await Seeder.createSharedSecretModel({
                    value: '01/01/2000',
                    sharedSecretType: Seeder.dob_sharedSecretType
                } as any);

                Seeder.fredjohnson_profile = await Seeder.createProfileModel({
                    provider: ProfileProvider.Temp.name,
                    name: Seeder.fredjohnson_name,
                    sharedSecrets: [Seeder.fredjohnson_dob]
                } as any);

                Seeder.fredjohnson_party = await Seeder.createPartyModel({
                    partyType: PartyType.Individual.name
                } as any);

                Seeder.log('');

                Seeder.fredjohnson_identity_1 = await Seeder.createIdentityModel({
                    identityType: IdentityType.InvitationCode.name,
                    defaultInd: true,
                    invitationCodeStatus: IdentityInvitationCodeStatus.Pending.name,
                    invitationCodeExpiryTimestamp: new Date(2055, 1, 1),
                    profile: Seeder.fredjohnson_profile,
                    party: Seeder.fredjohnson_party
                } as any);

                Seeder.log('');

                Seeder.j_and_f_relationship = await Seeder.createRelationshipModel({
                    relationshipType: Seeder.custom_delegate_relationshipType,
                    subject: Seeder.jenscatering_party,
                    subjectNickName: Seeder.jenscatering_name,
                    delegate: Seeder.fredjohnson_party,
                    delegateNickName: Seeder.fredjohnson_name,
                    startTimestamp: new Date(),
                    status: RelationshipStatus.Pending.name,
                    attributes: [
                        await Seeder.createRelationshipAttributeModel({
                            value: true,
                            attributeName: Seeder.permissionCustomisationAllowedInd_attributeName
                        } as any),
                        await Seeder.createRelationshipAttributeModel({
                            value: true,
                            attributeName: Seeder.delegateManageAuthorisationAllowedInd_attributeName
                        } as any),
                        await Seeder.createRelationshipAttributeModel({
                            value: true,
                            attributeName: Seeder.delegateRelationshipTypeDeclaration_attributeName
                        } as any),
                        await Seeder.createRelationshipAttributeModel({
                            value: true,
                            attributeName: Seeder.subjectRelationshipTypeDeclaration_attributeName
                        } as any)
                    ]
                } as any);

            }

        } catch (e) {
            Seeder.log('Seeding failed!');
            Seeder.log(e);
        }
    }

    public static async load() {
        await JensCateringRelationshipsSeeder.load_jenniferMaxim_associate();
        await JensCateringRelationshipsSeeder.load_robertsmith_invitationCode();
        await JensCateringRelationshipsSeeder.load_fredjohnson_invitationCode();
    }

}
