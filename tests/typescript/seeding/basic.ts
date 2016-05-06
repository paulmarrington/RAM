import {FakerTestHelper} from '../support/faker.test.helper';
import {RestCalls} from '../support/rest';
const rest = new RestCalls('localhost', 3000);

const parties = [{
  identities: [{
    name: 'Bob Bartholomew',
    type: 'pi',
    value: 'bob'
  }],
  i_can_act_for: [{
    name: FakerTestHelper.aShortBusinessName(),
    relationship: 'Associate',
    access_level: 'Universal',
    status: 'Active'
  }, {
      name: FakerTestHelper.aLongBusinessName(),
      relationship: 'User',
      access_level: 'Limited',
      status: 'Active'
    }, {
      name: 'Barbara Bartholomew',
      relationship: 'Family',
      access_level: 'Legal attorney',
      nick_name: 'Barb',
      status: 'Active'
    }],
  can_act_for_me: [{
    name: 'Susan Bartholomew',
    relationship: 'Spouse',
    access_level: 'Universal',
    nick_name: 'Suzy',
    status: 'Active'
  }]
}, {
    identities: [{
      name: 'Barbara Bartholomew',
      type: 'pi',
      value: 'barbara'
    }],
    i_can_act_for: [],
    can_act_for_me: []
  }, {
    identities: [{
      name: 'Susan Bartholomew',
      type: 'pi',
      value: 'susan'
    }],
    i_can_act_for: [],
    can_act_for_me: []
  }, {
    identities: [{
      name: FakerTestHelper.aShortBusinessName(),
      type: 'abn',
      value: '51515151151'
    }],
    i_can_act_for: [],
    can_act_for_me: []
  }, {
    identities: [{
      name: FakerTestHelper.aLongBusinessName(),
      type: 'abn',
      value: '61616161161'
    }],
    i_can_act_for: [{
      name: FakerTestHelper.aBizWhoGaveYouFullAccess(),
      relationship: 'Business you can act for',
      access_level: 'Universal',
      status: 'Active'
    }, {
        name: FakerTestHelper.aBizWhoGaveYouLimitedAccess(),
        relationship: 'Trust to trustee',
        access_level: 'Limited',
        status: 'Active'
      }],
    can_act_for_me: [{
      name: 'Alex Minimus',
      relationship: 'User',
      access_level: 'Universal',
      status: 'Active'
    }, {
        name: FakerTestHelper.b2bBusinessThatHasTrustsInMind(),
        relationship: 'Business acts for you',
        access_level: 'Limited',
        status: 'Active'
      }, {
        name: FakerTestHelper.cloudSoftwareForUSI(),
        relationship: 'Hosted software provider',
        access_level: 'Fixed',
        status: 'Active'
      }, {
        name: 'Henry Puffandstuff',
        relationship: 'User',
        access_level: 'Limited',
        status: 'Active'
      }, {
        name: 'Horatio Elvistar',
        relationship: 'User',
        access_level: 'Limited',
        status: 'Active'
      }]
  }, {
    identities: [{
      name: FakerTestHelper.aBizWhoGaveYouFullAccess(),
      type: 'abn',
      value: '21215251251'
    }],
    i_can_act_for: [],
    can_act_for_me: []
  }, {
    identities: [{
      name: FakerTestHelper.aBizWhoGaveYouLimitedAccess(),
      type: 'abn',
      value: '68686868868'
    }],
    i_can_act_for: [],
    can_act_for_me: []
  }, {
    identities: [{
      name: 'Alex Minimus',
      type: 'pi',
      value: 'alex'
    }],
    i_can_act_for: [],
    can_act_for_me: []
  }, {
    identities: [{
      name: FakerTestHelper.b2bBusinessThatHasTrustsInMind(),
      type: 'abn',
      value: '68686868868'
    }],
    i_can_act_for: [],
    can_act_for_me: []
  }, {
    identities: [{
      name: FakerTestHelper.cloudSoftwareForUSI(),
      type: 'abn',
      value: '22222222222'
    }],
    i_can_act_for: [],
    can_act_for_me: []
  }, {
    identities: [{
      name: 'Henry Puffandstuff',
      type: 'pi',
      value: 'henry'
    }],
    i_can_act_for: [],
    can_act_for_me: []
  }, {
    identities: [{
      name: 'Horatio Elvistar',
      type: 'pi',
      value: 'horatio'
    }],
    i_can_act_for: [],
    can_act_for_me: []
  }];

const addRoles = (party) => party.roles || [];
const addAttributes = (party) => party.attributes || {};
const addIdentities = (party) =>
  party.identities.map((identity) => identity);

const dbParties = {};

const buildRelaltionshipDocument = (rel) => {
  const now = new Date();
  const next_year = new Date(now.getTime() + 1000 * 60 * 60 * 12 * 365);
  return {
    type: rel.relationship || 'Universal',
    startTimestamp: now,
    endTimestamp: next_year,
    status: rel.status || 'Active'
  };
};

const addRelationship = (rel, myParty, subdel) => {
  const myDBParty = dbParties[myParty.identities[0].name];
  const theirDBParty = dbParties[rel.name];
  if (!theirDBParty) {
    console.log('No target party for ', rel.name, 'from', myParty.identities[0].name);
    return;
  }
  const doc = buildRelaltionshipDocument(rel);
  const me = (subdel === 'subject') ? 'delegate' : 'subject';
  doc[me + 'Id'] = myDBParty._id;
  doc[subdel + 'Id'] = theirDBParty.identities[0]._id;
  if (theirDBParty.identities[0].type === 'abn') {
    doc[subdel + 'Abn'] = theirDBParty.identities[0].value;
  }
  if (myDBParty.identities[0].type === 'abn') {
    doc[me + 'Abn'] = myDBParty.identities[0].value;
  }
  doc[subdel + 'Name'] = rel.name;
  doc[me + 'Name'] = myDBParty.identities[0].name;
  doc[subdel + 'Role'] = rel.relationship;
  if (myDBParty.roles.length > 0) {
    doc[me + 'Role'] = myDBParty.roles[0];
  }
  if (rel.nick_name) {
    doc[subdel + 'NickName'] = rel.nick_name;
  }
  rest.promisify(rest.post('relationship', doc));
};

describe('Seeding Test RAM Database...', () => {
  it('create parties', (done) => {
    parties.forEach(async (party) => {
      await rest.promisify(rest.post('party', {
        roles: addRoles(party),
        attributes: addAttributes(party),
        identities: addIdentities(party)
      }));
    });
  });
  it('create relationships', (done) => {
    // wait for parties to be written - too lazy to use promises here
    parties.forEach((party) => {
      party.i_can_act_for.forEach(async (rel) => {
        await addRelationship(rel, party, 'delegate');
      });
      party.can_act_for_me.forEach(async (rel) => {
        await addRelationship(rel, party, 'subject');
      });
    });
  });
});