import {get, post, put} from './rest';
import * as faker from 'faker';

export const fake_abn = () =>
  faker.random.number({min:10000000000, max:99999999999});

export const get_party = (abn: string) =>
  get('party/identity/' + abn + '/abn');

export const new_company_name = () => {
  return {
    givenName:        '',
    familyName:       '',
    unstructuredName: faker.company.companyName()
  };
};

// const new_identity_name = () => {
//   return {
//     givenName:        faker.name.firstName(),
//     familyName:       faker.name.lastName(),
//     unstructuredName: ''
//   };
// };

export const new_party = (abn: string) => {
  const doc = {
    roles: [
      {name:faker.name.jobArea(), attributes:{}, sharingAgencyIds:[]}
    ],
    attributes: {},
    identities: [{type: 'abn', value: abn, name: new_company_name()}]
  };
  return post('Party', doc);
}

export const new_two_identity_party = (abn_1) => {
  return new Promise((resolve, reject) => {
    const abn_2 = fake_abn();
    new_party(abn_1).then((res_1) => {
      const identity = {
        type:     'abn',
        value:    abn_2,
        name:     new_company_name()
      };
      put('party/identity/' + abn_1 + '/abn',

      {$addToSet: {identities: identity}}

      ).then((res_2) => resolve(res_2)
      ).catch((err) => reject(err));
    }).catch((err) => reject(err));
  })
}

export const update_party = (abn, updates) => {
  return new Promise((resolve, reject) => {
    new_two_identity_party(abn).then((partyDoc) => {
      const abn = partyDoc.identities[0].value
      put('party/identity/' + abn + '/abn', updates)
      .then((updatedParty) => resolve(updatedParty)
    ).catch((err) => reject(err));
    }).catch((err) => reject(err));
  });
};
