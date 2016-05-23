import {
  createNewPartyByABN, getPartyByABN
}  from './support/party';

import {FakerTestHelper} from './support/faker.test.helper';

describe('RAM Party', () => {
  it('can create a new identity and party', async (done) => {
    const party = await createNewPartyByABN(FakerTestHelper.fakeABNGenerator());
    expect(party.body.data).toEqual(jasmine.objectContaining(({ deleteInd: false })));
    done();
  });

  // it('can create a new identity for an existing party', async (done) => {
  //   const abn = FakerTestHelper.fakeABNGenerator();
  //   await createNewPartyByABN(abn);
  //   const partyWithTwoIdentities = await attachFakeABNIdentityToParty(abn);
  //   expect(partyWithTwoIdentities.body.data.identities.length).toEqual(2);
  //   done();
  // });

  it('can retrieve a party based on identity', async (done) => {
    const abn = FakerTestHelper.fakeABNGenerator();
    await createNewPartyByABN(abn);
    const partyRetrieved = await getPartyByABN(abn);
    if (!partyRetrieved.body.data) {
      fail(JSON.stringify(partyRetrieved.body, null, 2));
    } else {
      expect(partyRetrieved.body.data.identities.length).toEqual(1);
    }
    done();
  });
});

// describe('RAM Party', () => {
// it('can change party roles', async (done) => {
//   const abn = FakerTestHelper.fakeABNGenerator();
//   await createNewPartyByABN(abn);
//   const partyDoc = await updatePartyByABN(abn, {
//     $addToSet: { roles: { name: 'spouse' } },
//     $set: { 'attributes.magic': 'dark' }
//   });
//   expect(partyDoc.body.data.roles.length).toEqual(2);
//   done();
// });
// 
// it('can change party attributes', async (done) => {
//   const abn = FakerTestHelper.fakeABNGenerator();
//   await createNewPartyByABN(abn);
//   const partyDoc = await updatePartyByABN(abn, {
//     'attributes.magic': 'light'
//   });
//   expect(partyDoc.body.data.attributes.magic).toEqual('light');
//   done();
// });
// });

// describe('RAM Party', () => {
//   it('can delete identities', async (done) => {
//     const abn = FakerTestHelper.fakeABNGenerator();
//     await createNewPartyByABN(abn);
//     const secondABN = FakerTestHelper.fakeABNGenerator();
//     const updatedPartyWithNewABNIdentity = await updatePartyByABN(abn, {
//       $pull: { identities: { value: secondABN, type: 'abn' } }
//     });
//     expect(updatedPartyWithNewABNIdentity.body.data.identities.length).toEqual(1);
//     done();
//   });
// });