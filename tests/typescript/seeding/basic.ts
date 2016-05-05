import {FakerTestHelper} from '../support/faker.test.helper'
import {RestCalls} from '../support/rest';
const rest = new RestCalls('localhost', 3000);

const parties = [{
  identities: [{
    name:   'Bob Bartholomew',
    type:   'pi',
    value:  'bob'
  }],
  i_can_act_for:  [{
    name:         FakerTestHelper.aShortBusinessName(),
    relationship: 'Associate',
    access_level: 'Universal',
    status:       'Active'
  },{
    name:         FakerTestHelper.aLongBusinessName(),
    relationship: 'User',
    access_level: 'Limited',
    status:       'Active'
  },{
    name:         'Barbara Bartholomew',
    relationship: 'Family',
    access_level: 'Legal attorney',
    nick_name:    'Barb',
    status:       'Active'
  }],
  can_act_for_me: [{
    name:         'Susan Bartholomew',
    relationship: 'Spouse',
    access_level: 'Universal',
    nick_name:    'Suzy',
    status:       'Active'
  }]
},{
  identities: [{
    name:   'Barbara Bartholomew',
    type:   'pi',
    value:  'barbara'
  }],
  i_can_act_for:  [],
  can_act_for_me: []
},{
  identities: [{
    name:   'Susan Bartholomew',
    type:   'pi',
    value:  'susan'
  }],
  i_can_act_for:  [],
  can_act_for_me: []
},{
  identities: [{
    name:   FakerTestHelper.aShortBusinessName(),
    type:   'abn',
    value:  '51515151151'
  }],
  i_can_act_for:  [],
  can_act_for_me: []
},{
  identities: [{
    name:   FakerTestHelper.aLongBusinessName(),
    type:   'abn',
    value:  '61616161161'
  }],
  i_can_act_for:  [{
    name:         FakerTestHelper.aBizWhoGaveYouFullAccess(),
    relationship: 'Business you can act for',
    access_level: 'Universal',
    status:       'Active'
  },{
    name:         FakerTestHelper.aBizWhoGaveYouLimitedAccess(),
    relationship: 'Trust to trustee',
    access_level: 'Limited',
    status:       'Active'
  }],
  can_act_for_me: [{
    name:         'Alex Minimus',
    relationship: 'User',
    access_level: 'Universal',
    status:       'Active'
  },{
    name:         FakerTestHelper.b2bBusinessThatHasTrustsInMind(),
    relationship: 'Business acts for you',
    access_level: 'Limited',
    status:       'Active'
  },{
    name:         FakerTestHelper.cloudSoftwareForUSI(),
    relationship: 'Hosted software provider',
    access_level: 'Fixed',
    status:       'Active'
  },{
    name:         'Henry Puffandstuff',
    relationship: 'User',
    access_level: 'Limited',
    status:       'Active'
  },{
    name:         'Horatio Elvistar',
    relationship: 'User',
    access_level: 'Limited',
    status:       'Active'
  }]
},{
  identities: [{
    name:   FakerTestHelper.aBizWhoGaveYouFullAccess(),
    type:   'abn',
    value:  '21215251251'
  }],
  i_can_act_for:  [],
  can_act_for_me: []
},{
  identities: [{
    name:   FakerTestHelper.aBizWhoGaveYouLimitedAccess(),
    type:   'abn',
    value:  '68686868868'
  }],
  i_can_act_for:  [],
  can_act_for_me: []
},{
  identities: [{
    name:   'Alex Minimus',
    type:   'pi',
    value:  'alex'
  }],
  i_can_act_for:  [],
  can_act_for_me: []
},{
  identities: [{
    name:   FakerTestHelper.b2bBusinessThatHasTrustsInMind(),
    type:   'abn',
    value:  '68686868868'
  }],
  i_can_act_for:  [],
  can_act_for_me: []
},{
  identities: [{
    name:   FakerTestHelper.cloudSoftwareForUSI(),
    type:   'abn',
    value:  '22222222222'
  }],
  i_can_act_for:  [],
  can_act_for_me: []
},{
  identities: [{
    name:   'Henry Puffandstuff',
    type:   'pi',
    value:  'henry'
  }],
  i_can_act_for:  [],
  can_act_for_me: []
},{
  identities: [{
    name:   'Horatio Elvistar',
    type:   'pi',
    value:  'horatio'
  }],
  i_can_act_for:  [],
  can_act_for_me: []
}];

const add_roles = (party) => party.roles || [];
const add_attributes = (party) => party.attributes || {};
const add_identities = (party) =>
  party.identities.map((identity) => identity);

const db_parties = {};

const buildRelaltionshipDocument = (rel) => {
  const now = new Date();
  const next_year = new Date(now.getTime() + 1000*60*60*12*365);
  return {
    type:               rel.relationship || 'Universal',
    startTimestamp:     now,
    endTimestamp:       next_year,
    status:             rel.status || 'Active'
  };
};

const add_relationship = (rel, my_party, subdel) => {
    const my_db_party =     db_parties[my_party.identities[0].name];
    const their_db_party =  db_parties[rel.name];
    if (!their_db_party) {
      console.log('No target party for ',rel.name, 'from', my_party.identities[0].name);
      return;
    }
    const doc = buildRelaltionshipDocument(rel);
    const me = (subdel === 'subject') ? 'delegate' : 'subject';
    doc[me+'Id'] = my_db_party._id;
    doc[subdel+'Id'] = their_db_party.identities[0]._id;
    if (their_db_party.identities[0].type === 'abn') {
      doc[subdel+'Abn'] = their_db_party.identities[0].value;
    }
    if (my_db_party.identities[0].type === 'abn') {
      doc[me+'Abn'] = my_db_party.identities[0].value;
    }
    doc[subdel+'Name'] = rel.name;
    doc[me+'Name'] = my_db_party.identities[0].name;
    doc[subdel+'Role'] = rel.relationship;
    if (my_db_party.roles.length > 0) {
      doc[me+'Role'] = my_db_party.roles[0];
    }
    if (rel.nick_name) {
      doc[subdel+'NickName'] = rel.nick_name;
    }
    rest.promisify(rest.post('relationship', doc));
};

describe('Seeding Test RAM Database...', () => {
  it('create parties', (done) => {
    parties.forEach(async (party) => {
      await rest.promisify(rest.post('party', {
        roles:      add_roles(party),
        attributes: add_attributes(party),
        identities: add_identities(party)
      }));
    });
  });
  it('create relationships', (done) => {
    // wait for parties to be written - too lazy to use promises here
    parties.forEach((party) => {
      party.i_can_act_for.forEach(async (rel) => {
        await add_relationship(rel, party, 'delegate');
      });
      party.can_act_for_me.forEach(async (rel) => {
        await add_relationship(rel, party, 'subject');
      });
    });
  });
});