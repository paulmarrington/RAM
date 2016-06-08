import * as mongoose from 'mongoose';
import {connectDisconnectMongo, dropMongo} from './helpers';
import {
    IName,
    NameModel} from '../models/name.model';
import {
    IParty,
    PartyModel,
    PartyType} from '../models/party.model';
import {
    IRelationship,
    RelationshipModel,
    RelationshipStatus} from '../models/relationship.model';

/* tslint:disable:max-func-body-length */
describe('RAM Relationship', () => {

    connectDisconnectMongo();
    dropMongo();

    let subjectNickName1: IName;
    let subjectParty1: IParty;

    let delegateNickName1: IName;
    let delegateParty1: IParty;

    beforeEach(async (done) => {

        try {

            subjectNickName1 = await NameModel.create({
                givenName: 'Jane',
                familyName: 'Subject 1'
            });

            subjectParty1 = await PartyModel.create({
                partyType: PartyType.Individual.name,
                name: subjectNickName1
            });

            delegateNickName1 = await NameModel.create({
                givenName: 'John',
                familyName: 'Delegate 1'
            });

            delegateParty1 = await PartyModel.create({
                partyType: PartyType.Individual.name,
                name: delegateNickName1
            });

            done();

        } catch (e) {
            fail('Because ' + e);
            done();
        }

    });

    it('inserts with valid values', async (done) => {
        try {

            const instance = await RelationshipModel.create({
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

            done();

        } catch (e) {
            fail('Because ' + e);
            done();
        }
    });

});