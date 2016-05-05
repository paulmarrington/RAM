import {
  createNewPartyByABN, attachFakeABNIdentityToParty,
  getPartyByABN, updateParty
}  from './support/party';

import {FakerTestHelper} from './support/faker.test.helper';

const contains = (obj) => jasmine.objectContaining(obj);

describe('a RAM Party', () => {
  it('can create a new identity and party', async (done) => {
    const party = await createNewPartyByABN(FakerTestHelper.fakeABNGenerator());
    expect(party.body.data).toEqual(contains({ deleteInd: false }));
    done();
  });

  it('can create a new identity for an existing party', async (done) => {
    const abn = FakerTestHelper.fakeABNGenerator();
    await createNewPartyByABN(abn);
    const partyWithTwoIdentities = await attachFakeABNIdentityToParty(abn);
    expect(partyWithTwoIdentities.body.data.identities.length).toEqual(2);
    done();
  });

  it('can retrieve a party based on identity', async (done) => {
    const abn = FakerTestHelper.fakeABNGenerator();
    await createNewPartyByABN(abn);
    const partyRetrieved = await getPartyByABN(abn);
    expect(partyRetrieved.body.data.identities.length).toEqual(1);
    done();
  });
});
describe('more RAM Party', () => {
  it('can change party roles', async (done) => {
    const abn = FakerTestHelper.fakeABNGenerator();
    const partyDoc = await createNewPartyByABN(abn);
    await updateParty(abn, {
      $addToSet: { roles: { name: 'spouse' } },
      $set: { 'attributes.magic': 'dark' }
    });
    expect(partyDoc.body.data.roles.length).toEqual(2);
    done();
  });
  
  it('can change party attributes', async (done) => {
    const abn = FakerTestHelper.fakeABNGenerator();
    const partyDoc = await createNewPartyByABN(abn);
    await updateParty(FakerTestHelper.fakeABNGenerator(), {
      'attributes.magic': 'light'
      expect(partyDoc.body.data.attributes.magic).toEqual('light');
    done();

  });
  it('can delete identities', async (done) => {
    const abn = FakerTestHelper.fakeABNGenerator();
    const partyDoc = await createNewPartyByABN(abn);

    const abn_1 = FakerTestHelper.fakeABNGenerator();
    await updateParty(abn_1, {
      $pull: { identities: { value: abn_1, type: 'abn' } },

      expect(updatedParty.body.data.identities.length).toEqual(1);
    done();

  });
});