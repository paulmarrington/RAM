import {
  new_party, fake_abn, new_two_identity_party,
  get_party, update_party
}  from './support/party';

const contains = (obj) => jasmine.objectContaining(obj);

describe('a RAM Party', () => {
  it('can create a new identity and party', (done) => {
    new_party(fake_abn()).then((result) => {
      expect(result).toEqual(contains({ deleted: false }));
      done();
    }).catch((err) => { fail(err); done(); });
  });
  it('can create a new identity for an existing party', (done) => {
    new_two_identity_party(fake_abn()).then((result) => {
      expect(result.identities.length).toEqual(2);
      done();
    }).catch((err) => { fail(err); done(); });
  });
  it('can retrieve a party based on identity', (done) => {
    const abn = fake_abn();
    new_party(abn).then((result) => {
      get_party(abn).then((result) => {
        expect(result.identities.length).toEqual(1);
        done();
      }).catch((err) => { fail(err); done(); });
    }).catch((err) => { fail(err); done(); });
  });
  it('can retrieve a list of identities for a party', (done) => {
    new_two_identity_party(fake_abn()).then((result) => {
      expect(result.identities.length).toEqual(2);
      done();
    }).catch((err) => { fail(err); done(); });
  });
});
describe('more RAM Party', () => {
  it('can change party roles', (done) => {
    update_party(fake_abn(), {
        $addToSet: {roles: {name: 'spouse'}},
        $set:      {'attributes.magic': 'dark'}
      }
    ).then( (partyDoc) => {
      expect(partyDoc.roles.length).toEqual(2);
      done();
    }).catch((err) => { fail(err); done(); });
  });
  it('can change party attributes', (done) => {
    update_party(fake_abn(), {
      'attributes.magic': 'light'
    }).then((partyDoc) => {
      expect(partyDoc.attributes.magic).toEqual('light');
      done();
    }).catch((err) => { fail(err); done(); });
  });
  it('can delete identities', (done) => {
    const abn_1 = fake_abn();
    update_party(abn_1, {
      $pull: {identities: {value:abn_1, type:'abn'}},
    }).then((updatedParty) => {
      expect(updatedParty.identities.length).toEqual(1);
      done();
    }).catch((err) => { fail(err); done(); });
  });
});