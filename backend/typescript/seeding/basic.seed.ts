
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

const parties = [{
  identities: [{
    name: bob,
    type: 'pi',
    value: 'bob'
  }],
  i_can_act_for: [{
    name: aShortBusinessName,
    relationship: 'Associate',
    access_level: 'Universal',
    status: 'Active'
  }, {
      name: aLongBusinessName,
      relationship: 'User',
      access_level: 'Limited',
      status: 'Active'
    }, {
      name: barb,
      relationship: 'Family',
      access_level: 'Legal attorney',
      nick_name: 'Barb',
      status: 'Active'
    }],
  can_act_for_me: [{
    name: susan,
    relationship: 'Spouse',
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
    i_can_act_for: [],
    can_act_for_me: []
  }, {
    identities: [{
      name: susan,
      type: 'pi',
      value: 'susan'
    }],
    i_can_act_for: [],
    can_act_for_me: []
  }, {
    identities: [{
      name: aShortBusinessName,
      type: 'abn',
      value: '51515151151'
    }],
    i_can_act_for: [],
    can_act_for_me: []
  }, {
    identities: [{
      name: aLongBusinessName,
      type: 'abn',
      value: '61616161161'
    }],
    i_can_act_for: [{
      name: aBizWhoGaveYouFullAccess,
      relationship: 'Business you can act for',
      access_level: 'Universal',
      status: 'Active'
    }, {
        name: aBizWhoGaveYouLimitedAccess,
        relationship: 'Trust to trustee',
        access_level: 'Limited',
        status: 'Active'
      }],
    can_act_for_me: [{
      name: alex,
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
      name: aBizWhoGaveYouFullAccess,
      type: 'abn',
      value: '21215251251'
    }],
    i_can_act_for: [],
    can_act_for_me: []
  }, {
    identities: [{
      name: aBizWhoGaveYouLimitedAccess,
      type: 'abn',
      value: '68686868868'
    }],
    i_can_act_for: [],
    can_act_for_me: []
  }, {
    identities: [{
      name: alex,
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

console.log(parties)