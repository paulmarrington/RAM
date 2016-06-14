import {connectDisconnectMongo} from './helpers';
import {
    IName,
    NameModel
} from '../models/name.model';
import {
    IParty,
    PartyModel,
    PartyType
} from '../models/party.model';
import {
    IRelationship,
    RelationshipModel,
    RelationshipStatus
} from '../models/relationship.model';
import {IRelationshipType, RelationshipTypeModel} from '../models/relationshipType.model';
import {Seeder} from '../seeding/seed';

/* tslint:disable:max-func-body-length */
describe('RAM Relationship', () => {

    connectDisconnectMongo();

    let relationshipTypeCustom:IRelationshipType;

    let subjectNickName1:IName;
    let subjectParty1:IParty;

    let delegateNickName1:IName;
    let delegateParty1:IParty;

    beforeEach((done) => {

        Seeder.verbose(false);

        Promise.resolve(null)
            .then()
            .then(Seeder.resetDataInMongo)
            .then(Seeder.loadReference)
            .then(async ()=> {
                try {

                    relationshipTypeCustom = await RelationshipTypeModel.findByCodeIgnoringDateRange('CUSTOM_REPRESENTATIVE');

                    subjectNickName1 = await NameModel.create({
                        givenName: 'Jane',
                        familyName: 'Subject 1'
                    });

                    subjectParty1 = await PartyModel.create({
                        partyType: PartyType.Individual.name
                    });

                    delegateNickName1 = await NameModel.create({
                        givenName: 'John',
                        familyName: 'Delegate 1'
                    });

                    delegateParty1 = await PartyModel.create({
                        partyType: PartyType.Individual.name
                    });

                } catch (e) {
                    fail('Because ' + e);
                    done();
                }

            }).then(()=> {
                done();
            });
    });

    it('inserts with no end timestamp', async(done) => {
        try {

            const instance:IRelationship = await RelationshipModel.create({
                relationshipType: relationshipTypeCustom,
                subject: subjectParty1,
                subjectNickName: subjectNickName1,
                delegate: delegateParty1,
                delegateNickName: delegateNickName1,
                startTimestamp: new Date(),
                status: RelationshipStatus.Active.name
            });

            expect(instance).not.toBeNull();
            expect(instance.id).not.toBeNull();
            expect(instance.subject).not.toBeNull();
            expect(instance.status).not.toBeNull();
            expect(instance.statusEnum()).toBe(RelationshipStatus.Active);
            expect(instance.endEventTimestamp).toBeFalsy();

            done();

        } catch (e) {
            fail('Because ' + e);
            done();
        }
    });

    it('inserts with end timestamp', async(done) => {
        try {

            const instance:IRelationship = await RelationshipModel.create({
                relationshipType: relationshipTypeCustom,
                subject: subjectParty1,
                subjectNickName: subjectNickName1,
                delegate: delegateParty1,
                delegateNickName: delegateNickName1,
                startTimestamp: new Date(),
                endTimestamp: new Date(),
                status: RelationshipStatus.Active.name
            });

            expect(instance).not.toBeNull();
            expect(instance.id).not.toBeNull();
            expect(instance.subject).not.toBeNull();
            expect(instance.status).not.toBeNull();
            expect(instance.statusEnum()).toBe(RelationshipStatus.Active);
            expect(instance.endEventTimestamp).not.toBeFalsy();

            done();

        } catch (e) {
            fail('Because ' + e);
            done();
        }
    });

});