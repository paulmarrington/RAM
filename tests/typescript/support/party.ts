import {RestCalls, get, post, put} from './rest';
import * as faker from 'faker';
import * as async from 'async';

const rest = new RestCalls("localhost", 3000);

export const getPartyByABN = (abn: string) =>
  getPartyByResolver(abn, 'abn');

export const getPartyByResolver = (identityValue: string, resolver: string) =>
  rest.get('party/identity/' + identityValue + '/' + resolver);

export const fakeCompanyNameGenerator = () => {
  return {
    givenName: '',
    familyName: '',
    unstructuredName: faker.company.companyName()
  };
};

export const fakeABNGenerator = () =>
  faker.random.number({ min: 10000000000, max: 99999999999 });

export const fakeIdentityNameGenerator = () => {
  return {
    givenName: faker.name.firstName(),
    familyName: faker.name.lastName(),
    unstructuredName: ''
  };
};

export const createNewPartyByABN = (abn: number) => {
  const doc = {
    roles: [
      { name: faker.name.jobArea(), attributes: {}, sharingAgencyIds: [] }
    ],
    attributes: {},
    identities: [{ type: 'abn', value: abn, name: fakeCompanyNameGenerator() }]
  };
  return rest.post('Party', doc);
}

export const createPartyWithTwoIdentities = (abn, tester) => {
  const abn_2 = fakeABNGenerator();
  const createSecondIdentity = () => {
    const identity = {
      type: 'abn',
      value: abn_2,
      name: fakeCompanyNameGenerator()
    };
    return rest.put('party/identity/' + abn + '/abn',
      { $addToSet: { identities: identity } }
    );
  };
  
  async.series([
    (cb) => createNewPartyByABN(abn).expect(200, cb),
    (cb) => createSecondIdentity().expect(tester).end(cb)
  ]);
};

export const updateParty = (abn, updates) => {
  return new Promise((resolve, reject) => {
    createPartyWithTwoIdentities(abn).then((partyDoc) => {
      const abn = partyDoc.identities[0].value
      rest.put('party/identity/' + abn + '/abn', updates)
        .then((updatedParty) => resolve(updatedParty)
        ).catch((err) => reject(err));
    }).catch((err) => reject(err));
  });
};
