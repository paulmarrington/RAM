// /// <reference path="../../typings/main.d.ts" />

// import * as agent from 'superagent';

// const addRoles = (party) => party.roles || [];
// const addAttributes = (party) => party.attributes || {};
// const buildName = (type: string, name: string) => {
//   if (type === 'abn') {
//     return {
//       unstructuredName: name,
//       givenName:        '',
//       familyName:       ''
//     };
//   } else {
//     const parts = name.split(' ');
//     return {
//       unstructuredName: name,
//       givenName:        parts[0],
//       familyName:       parts[1]
//     };
//   }
// }
// const addIdentities = (party) =>
//   party.identities.map((identity) => {
//     return {
//       type:   identity.type,
//       value:  identity.value,
//       name:   buildName(identity.type, identity.name)
//     };
//   });

// const dbParties = {};

// const buildRelaltionshipDocument = (rel) => {
//   const now = new Date();
//   const next_year = new Date(now.getTime() + 1000 * 60 * 60 * 12 * 365);
//   return {
//     type: rel.relationship || 'Universal',
//     startTimestamp: now,
//     endTimestamp: next_year,
//     status: rel.status || 'Active'
//   };
// };

// const addRelationship = (rel, myParty, subdel) => {
//   const myDBParty = dbParties[myParty.identities[0].name];
//   const theirDBParty = dbParties[rel.name];
//   if (!theirDBParty) {
//     console.log('No target party for ', rel.name, 'from',
//     myParty.identities[0].name);
//     return;
//   }
//   const doc = buildRelaltionshipDocument(rel);
//   const me = (subdel === 'subject') ? 'delegate' : 'subject';
//   doc[me + 'Id'] = myDBParty._id;
//   doc[subdel + 'Id'] = theirDBParty.identities[0]._id;
//   if (theirDBParty.identities[0].type === 'abn') {
//     doc[subdel + 'Abn'] = theirDBParty.identities[0].value;
//   }
//   if (myDBParty.identities[0].type === 'abn') {
//     doc[me + 'Abn'] = myDBParty.identities[0].value;
//   }
//   doc[subdel + 'Name'] = rel.name;
//   doc[me + 'Name'] = myDBParty.identities[0].name.unstructuredName;
//   doc[subdel + 'Role'] = rel.relationship;
//   if (myDBParty.roles.length > 0) {
//     doc[me + 'Role'] = myDBParty.roles[0];
//   }
//   if (rel.nick_name) {
//     doc[subdel + 'NickName'] = rel.nick_name;
//   }
//   rest.promisify(rest.post('relationship', doc));
// };

// const createParties = async (parties, done) => {
//     return await Promise.all(parties.map(async (party) => {
//       const res = await rest.promisify(rest.post('party', {
//         roles: addRoles(party),
//         attributes: addAttributes(party),
//         identities: addIdentities(party)
//       }));
//       dbParties[party.identities[0].name] = res.body.data;
//       return res;
//     });
//   });
  
// const createRelationships = (parties done) => {
//     // wait for parties to be written - too lazy to use promises here
//     parties.forEach((party) => {
//       party.i_can_act_for.forEach(async (rel) => {
//         await addRelationship(rel, party, 'delegate');
//       });
//       party.can_act_for_me.forEach(async (rel) => {
//         await addRelationship(rel, party, 'subject');
//       });
//     });
//     done();
//   });
// });