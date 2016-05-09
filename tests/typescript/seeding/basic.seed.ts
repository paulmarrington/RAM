import {FakerTestHelper} from '../support/faker.test.helper';
import {RestCalls} from '../support/rest';
const rest = new RestCalls('localhost', 3000);

const shortBusinessName = FakerTestHelper.shortBusinessName();
const longBusinessName = FakerTestHelper.longBusinessName();
const bizWhoGaveYouFullAccess = FakerTestHelper.shortBusinessName();
const bizWhoGaveYouLimitedAccess = FakerTestHelper.shortBusinessName();
const b2bBusinessThatHasTrustsInMind = FakerTestHelper.companyNameWithPostfix(' Trustees')();
const cloudSoftwareForUSI = FakerTestHelper.companyNameWithPostfix(' Clouds')();

const parties = [{
  identities: [{
    name: 'Bob Bartholomew',
    type: 'pi',
    value: 'bob'
  }],
  i_can_act_for: [{
    name: shortBusinessName,
    relationship: 'Associate',
    access_level: 'Universal',
    status: 'Active'
  }, {
      name: longBusinessName,
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
      name: shortBusinessName,
      type: 'abn',
      value: '51515151151'
    }],
    i_can_act_for: [],
    can_act_for_me: []
  }, {
    identities: [{
      name: longBusinessName,
      type: 'abn',
      value: '61616161161'
    }],
    i_can_act_for: [{
      name: bizWhoGaveYouFullAccess,
      relationship: 'Business you can act for',
      access_level: 'Universal',
      status: 'Active'
    }, {
        name: bizWhoGaveYouLimitedAccess,
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
        name: b2bBusinessThatHasTrustsInMind,
        relationship: 'Business acts for you',
        access_level: 'Limited',
        status: 'Active'
      }, {
        name: cloudSoftwareForUSI,
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
      name: bizWhoGaveYouFullAccess,
      type: 'abn',
      value: '21215251251'
    }],
    i_can_act_for: [],
    can_act_for_me: []
  }, {
    identities: [{
      name: bizWhoGaveYouLimitedAccess,
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
      name: b2bBusinessThatHasTrustsInMind,
      type: 'abn',
      value: '68686868868'
    }],
    i_can_act_for: [],
    can_act_for_me: []
  }, {
    identities: [{
      name: cloudSoftwareForUSI,
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
const buildName = (type: string, name: string) => {
  if (type === 'abn') {
    return {
      unstructuredName: name,
      givenName: '',
      familyName: ''
    };
  } else {
    const parts = name.split(' ');
    return {
      unstructuredName: name,
      givenName: parts[0],
      familyName: parts[1]
    };
  };
};

const mapIdentitiesToName = (party) =>
  party.identities.map((identity) => {
    return {
      type: identity.type,
      value: identity.value,
      name: buildName(identity.type, identity.name)
    };
  });

const partiesInDBFormatCache = {};

const buildRelaltionship = (rel) => {
  const now = new Date();
  const nextYear = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 365);
  return {
    type: rel.relationship || 'Universal',
    startTimestamp: now,
    endTimestamp: nextYear,
    status: rel.status || 'Active'
  };
};

const addRelationship = (rel, myParty, subjectOrDelegate) => {
  const myDBParty = partiesInDBFormatCache[myParty.identities[0].name];
  const theirDBParty = partiesInDBFormatCache[rel.name];
  if (!theirDBParty) {
    console.log('No target party for ', rel.name, 'from',
      myParty.identities[0].name);
    return;
  }
  const relationship = buildRelaltionship(rel);
  const me = (subjectOrDelegate === 'subject') ? 'delegate' : 'subject';
  relationship[me + 'Id'] = myDBParty._id;
  relationship[subjectOrDelegate + 'Id'] = theirDBParty.identities[0]._id;

  if (theirDBParty.identities[0].type === 'abn') {
    relationship[subjectOrDelegate + 'Abn'] = theirDBParty.identities[0].value;
  }
  if (myDBParty.identities[0].type === 'abn') {
    relationship[me + 'Abn'] = myDBParty.identities[0].value;
  }
  relationship[subjectOrDelegate + 'Name'] = rel.name;
  relationship[me + 'Name'] = myDBParty.identities[0].name.unstructuredName;
  relationship[subjectOrDelegate + 'Role'] = rel.relationship;
  if (myDBParty.roles.length > 0) {
    relationship[me + 'Role'] = myDBParty.roles[0];
  }
  if (rel.nick_name) {
    relationship[subjectOrDelegate + 'NickName'] = rel.nick_name;
  }
  rest.promisify(rest.post('relationship', relationship));
};

describe('Seeding Test RAM Database...', () => {
  it('create parties', async (done) => {
    await Promise.all(parties.map(async (party) => {
      const res = await rest.promisify(rest.post('party', {
        roles: addRoles(party),
        attributes: addAttributes(party),
        identities: mapIdentitiesToName(party)
      }));
      partiesInDBFormatCache[party.identities[0].name] = res.body.data;
    }));
    done();
  });
  it('create relationships', async (done) => {
    // wait for parties to be written - too lazy to use promises here
    await Promise.all(parties.map((party) => {
      party.i_can_act_for.forEach(async (rel) => {
        await addRelationship(rel, party, 'delegate');
      });
      party.can_act_for_me.forEach(async (rel) => {
        await addRelationship(rel, party, 'subject');
      });
    }));
    done();
  });
});