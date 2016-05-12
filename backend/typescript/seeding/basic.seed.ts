
import {seed, BParty} from './seed.script';

const bob = 'Bob Bartholomew';
const barb = 'Barbara Bartholomew';
const susan = 'Susan Bartholomew';
const alex = 'Alex Minimus';

const aShortBusinessName = 'A short name biz name';
const aLongBusinessName = 'A longish business name for the trust entity of another trusting bunch of people';
const aBizWhoGaveYouFullAccess = 'A biz who gave you access';
const aBizWhoGaveYouLimitedAccess = 'A business that limited your access because they have good reasons';
const b2bBusinessThatHasTrustsInMind = 'B2B busines that has trusts in mind';
const cloudSoftwareForUSI = 'Cloud software for USI';

const parties:[BParty] = [{
  identities: [{
    name: bob,
    type: 'pi',
    value: 'bob'
  }],
  i_can_act_for: [{
    name: aShortBusinessName,
    relationship: 'Business',
    access_level: 'Universal',
    status: 'Active'
  }, {
      name: aLongBusinessName,
      relationship: 'Business',
      access_level: 'Limited',
      status: 'Active'
    }, {
      name: barb,
      access_level: 'Legal attorney',
      nick_name: 'Barb',
      status: 'Active'
    }],
  can_act_for_me: [{
    name: susan,
    access_level: 'Universal',
    nick_name: 'Suzy',
    status: 'Active'
  }]
}, {
    identities: [{
      name: barb,
      type: 'pi',
      value: 'barbara'
    }],
  }, {
    identities: [{
      name: susan,
      type: 'pi',
      value: 'susan'
    }],
  }, {
    identities: [{
      name: aShortBusinessName,
      type: 'abn',
      value: '51515151151'
    }],
  }, {
    identities: [{
      name: aLongBusinessName,
      type: 'abn',
      value: '61616161161'
    }],
    i_can_act_for: [{
      name: aBizWhoGaveYouFullAccess,
      relationship: 'Business',
      access_level: 'Universal',
      status: 'Active'
    }, {
        name: aBizWhoGaveYouLimitedAccess,
        relationship: 'Business',
        access_level: 'Limited',
        status: 'Active'
      }],
    can_act_for_me: [{
      name: alex,
      access_level: 'Universal',
      status: 'Active'
    }, {
        name: b2bBusinessThatHasTrustsInMind,
        relationship: 'Business',
        access_level: 'Limited',
        status: 'Active'
      }, {
        name: cloudSoftwareForUSI,
        relationship: 'Online Service Provider',
        access_level: 'Fixed',
        status: 'Active'
      }, {
        name: 'Henry Puffandstuff',
        access_level: 'Limited',
        status: 'Active'
      }, {
        name: 'Horatio Elvistar',
        access_level: 'Limited',
        status: 'Active'
      }]
  }, {
    identities: [{
      name: aBizWhoGaveYouFullAccess,
      type: 'abn',
      value: '21215251251'
    }],
  }, {
    identities: [{
      name: aBizWhoGaveYouLimitedAccess,
      type: 'abn',
      value: '68686868868'
    }],
  }, {
    identities: [{
      name: alex,
      type: 'pi',
      value: 'alex'
    }],
  }, {
    identities: [{
      name: b2bBusinessThatHasTrustsInMind,
      type: 'abn',
      value: '68686868868'
    }],
  }, {
    identities: [{
      name: cloudSoftwareForUSI,
      type: 'abn',
      value: '22222222222'
    }],
  }, {
    identities: [{
      name: 'Henry Puffandstuff',
      type: 'pi',
      value: 'henry'
    }],
  }, {
    identities: [{
      name: 'Horatio Elvistar',
      type: 'pi',
      value: 'horatio'
    }],
  }];

seed(parties);