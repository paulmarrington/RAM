import {RestCalls} from './rest';
import {Response} from 'superagent';
import {FakerTestHelper} from './faker.test.helper';

const rest = new RestCalls('127.0.0.1', 3000);

export const getPartyByResolver = (identityValue: string, resolver: string) =>
  rest.promisify(rest.get('/v1/party/identity/' + identityValue + '/' + resolver));

export const getPartyByABN = (abn: string) =>
  getPartyByResolver(abn, 'abn');

export const createNewPartyByABN = (abn: string): Promise<Response> => {
  const doc = {
    roles: [
      {
        name: FakerTestHelper.fakeJobArea(),
        attributes: {}, sharingAgencyIds: []
      }
    ],
    attributes: {},
    identities: [{
      type: 'abn',
      value: abn,
      name: FakerTestHelper.fakeCompanyNameGenerator()
    }]
  };
  return rest.promisify(rest.post('party', doc));
};

// export const attachFakeABNIdentityToParty = (abn) => {
//   const abn2 = FakerTestHelper.fakeABNGenerator();
//   const identity = {
//     type: 'abn',
//     value: abn2,
//     name: FakerTestHelper.fakeCompanyNameGenerator()
//   };
//   return rest.promisify(rest.put('party/identity/' + abn + '/abn',
//     { $addToSet: { identities: identity } }
//   ));
// };
