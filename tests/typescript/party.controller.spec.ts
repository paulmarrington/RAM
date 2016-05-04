import {
  createNewPartyByABN, fakeABNGenerator, createPartyWithTwoIdentities,
  getPartyByABN, updateParty
}  from './support/party';

const contains = (obj) => jasmine.objectContaining(obj);

describe('a RAM Party', () => {
  it('can create a new identity and party', (done) => {
    createNewPartyByABN(fakeABNGenerator()).expect((res) => {
      expect(res.body.data).toEqual(contains({ deleteInd: false }));
    }).end(done);
  });

  it('can create a new identity for an existing party', (done) => {
    createPartyWithTwoIdentities(fakeABNGenerator(), (res) => {
      expect(res.body.data.identities.length).toEqual(2);
      done();
    });
  });

  //   it('can retrieve a party based on identity', (done) => {
  //     const abn = fakeABNGenerator();
  //     createNewPartyByABN(abn).then((result) => {
  //       getPartyByABN(abn).then((result) => {
  //         expect(result.identities.length).toEqual(1);
  //         done();
  //       }).catch((err) => { fail(err); done(); });
  //     }).catch((err) => { fail(err); done(); });
  //   });
  //   it('can retrieve a list of identities for a party', (done) => {
  //     createPartyWithTwoIdentities(fakeABNGenerator()).then((result) => {
  //       expect(result.identities.length).toEqual(2);
  //       done();
  //     }).catch((err) => { fail(err); done(); });
  //   });
  // });

  // xdescribe('more RAM Party', () => {
  //   it('can change party roles', (done) => {
  //     updateParty(fakeABNGenerator(), {
  //       $addToSet: { roles: { name: 'spouse' } },
  //       $set: { 'attributes.magic': 'dark' }
  //     }
  //     ).then((partyDoc) => {
  //       expect(partyDoc.roles.length).toEqual(2);
  //       done();
  //     }).catch((err) => { fail(err); done(); });
  //   });
  //   it('can change party attributes', (done) => {
  //     updateParty(fakeABNGenerator(), {
  //       'attributes.magic': 'light'
  //     }).then((partyDoc) => {
  //       expect(partyDoc.attributes.magic).toEqual('light');
  //       done();
  //     }).catch((err) => { fail(err); done(); });
  //   });
  //   it('can delete identities', (done) => {
  //     const abn_1 = fakeABNGenerator();
  //     updateParty(abn_1, {
  //       $pull: { identities: { value: abn_1, type: 'abn' } },
  //     }).then((updatedParty) => {
  //       expect(updatedParty.identities.length).toEqual(1);
  //       done();
  //     }).catch((err) => { fail(err); done(); });
  //   });
});
});