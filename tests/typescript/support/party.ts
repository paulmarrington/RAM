import {RestCalls} from './rest';
import {Response} from 'superagent';
import {FakerTestHelper} from './faker.test.helper';

const rest = new RestCalls('localhost', 3000);

export const getPartyByResolver = (identityValue: string, resolver: string) =>
  rest.promisify(rest.get('party/identity/' + identityValue + '/' + resolver));

export const getPartyByABN = (abn: string) =>
  getPartyByResolver(abn, 'abn');

export const createNewPartyByABN = (abn: string): Promise<Response> => {
  const doc = {
    roles: [
      { name: FakerTestHelper.fakeJobArea(), attributes: {}, sharingAgencyIds: [] }
    ],
    attributes: {},
    identities: [{ type: 'abn', value: abn, name: FakerTestHelper.fakeCompanyNameGenerator() }]
  };
  return rest.promisify(rest.post('party', doc));
}

export const attachFakeABNIdentityToParty = (abn) => {
  const abn2 = FakerTestHelper.fakeABNGenerator();
  const identity = {
    type: 'abn',
    value: abn2,
    name: FakerTestHelper.fakeCompanyNameGenerator()
  };
  return rest.promisify(rest.put('party/identity/' + abn + '/abn',
    { $addToSet: { identities: identity } }
  ));
};

export const updatePartyByABN = (abn, updates) =>
  rest.promisify(rest.put('party/identity/' + abn + '/abn', updates));
