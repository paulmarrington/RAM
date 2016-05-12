/// <reference path="../../typings/main.d.ts" />
import * as agent from 'superagent';
//import {IRelationship} from '../models/relationship.model';

const post = (url: string, body: Object) => {
  url = 'http' + '://localhost:3000/api/v1/' + url;
  return new Promise((resolver, reject) =>
    agent.post(url).send(body).end((err, res) => {
      if (err) {
        reject(err);
      } else {
        resolver(res);
      }
    })
  );
};

interface BRelationship {
  relationship?:  string;
  status?:        string;
  name?:          string;
  nick_name?:     string;
  access_level?:  string;
}

interface BIdentity {
  _id?:   string;
  type:   string;
  value:  string;
  name:   string;
  unstructuredName?: string;
}

export interface BParty {
  roles?:         [string];
  attributes?:    {};
  identities:     [BIdentity];
  i_can_act_for?: [BRelationship];
  can_act_for_me?:[BRelationship];
}

interface IName {
  givenName:        string;
  familyName:         string;
  unstructuredName: string;
}

interface IIdentity {
  _id?:    string;
  type:   string;
  value:  string;
  name:   IName;
}

interface IParty {
  _id:            string;
  roles:          [string];
  attributes:     {};
  identities:     [IIdentity];
  i_can_act_for:  [IRelationship];
  can_act_for_me: [IRelationship];
}

const addRoles = (party:BParty) => party.roles || [] as [string];
const addAttributes = (party:BParty) => party.attributes || {};
const buildName = (type: string, name: string) : IName => {
  if (type === 'abn') {
    return {
      unstructuredName: name,
      givenName:        '',
      familyName:       ''
    };
  } else {
    const parts = name.split(' ');
    return {
      unstructuredName: name,
      givenName:        parts[0],
      familyName:       parts[1]
    };
  }
}
const addIdentities = (party:BParty) : IIdentity[] =>
  party.identities.map((identity:BIdentity) : IIdentity => {
    return {
      type:   identity.type,
      value:  identity.value,
      name:   buildName(identity.type, identity.name)
    };
  });

const dbParties: {[name:string]:IParty} = {};

const buildRelaltionshipDocument = (rel:BRelationship) => {
  const now = new Date();
  const next_year = new Date(now.getTime() + 1000 * 60 * 60 * 12 * 365);
  const dbRel:IRelationship = {
    type: rel.relationship,
    startTimestamp: now,
    endTimestamp: next_year,
    status: rel.status || 'Active'
  };
  if (! rel.relationship) {
    delete dbRel.type;
  }
  return dbRel;
};

interface IRelationship {
  type?:             string;
  status?:           string;
  startTimestamp?:   Date;
  endTimestamp?:     Date;
  delegateId?:       string;
  delegateAbn?:      string;
  delegateName?:     string;
  delegateRole?:     string;
  delegateNickName?: string;
  subjectId?:        string;
  subjectAbn?:       string;
  subjectName?:      string;
  subjectRole?:      string;
  subjectNickName?:  string;
}

const postRelationship = async (doc: IRelationship) => {
  const val = await post('relationship', doc);
  const irc:IRC = val as IRC;
  if (irc.body.alert) {
    console.log(irc.body);
    process.exit(1);
  }
  return irc;
};

const getDBParty = (name:string) => {
  const party = dbParties[name];
  if (!party) {
    console.log('No target party for ', name);
    process.exit(2);
  }
  return party;
};

const forSubject = (doc: IRelationship, rel: BRelationship,
                    myDBParty: IParty,  theirDBParty: IParty) => {
  doc.delegateId = myDBParty._id;
  doc.subjectId = theirDBParty._id;
  if (theirDBParty.identities[0].type === 'abn') {
    doc.subjectAbn = theirDBParty.identities[0].value;
  }
  if (myDBParty.identities[0].type === 'abn') {
    doc.delegateAbn = myDBParty.identities[0].value;
  }
  doc.subjectName = rel.name;
  doc.delegateName = myDBParty.identities[0].name.unstructuredName;
  doc.subjectRole = rel.relationship || 'Unknown';
  if (myDBParty.roles.length > 0) {
    doc.delegateRole = myDBParty.roles[0];
  } else {
    doc.delegateRole = 'Guesswork';
  }
  if (rel.nick_name) {
    doc.subjectNickName = rel.nick_name;
  }
};

const forDelegate = (doc: IRelationship, rel: BRelationship,
                     myDBParty: IParty,  theirDBParty: IParty) => {
    doc.subjectId = myDBParty._id;
    doc.delegateId = theirDBParty._id;
    if (theirDBParty.identities[0].type === 'abn') {
      doc.delegateAbn = theirDBParty.identities[0].value;
    }
    if (myDBParty.identities[0].type === 'abn') {
      doc.subjectAbn = myDBParty.identities[0].value;
    }
    doc.delegateName = rel.name;
    doc.subjectName = myDBParty.identities[0].name.unstructuredName;
    doc.delegateRole = rel.relationship || 'Unknown';
    if (myDBParty.roles.length > 0) {
      doc.subjectRole = myDBParty.roles[0];
    } else {
      doc.subjectRole = 'Guesswork';
    }
    if (rel.nick_name) {
      doc.delegateNickName = rel.nick_name;
    }
};
const addRelationship =
async (rel:BRelationship, myParty:BParty, subdel:string) => {
  const myDBParty = dbParties[myParty.identities[0].name];
  const theirDBParty = getDBParty(rel.name);
  const doc:IRelationship = buildRelaltionshipDocument(rel);

  if (subdel === 'subject') {
    forSubject(doc, rel, myDBParty, theirDBParty);
  } else {
    forDelegate(doc, rel, myDBParty, theirDBParty);
  }
  return postRelationship(doc);
};

interface IAlert {
  messages:  [string];
  alertType: Number;
}

interface IBody {
  alert?:   [IAlert];
  data:     Object;
}
interface IRC {
  body: IBody;
}

const createParty = async (party:BParty) => {
  const val = await post('party', {
    roles:      addRoles(party),
    attributes: addAttributes(party),
    identities: addIdentities(party)
  });
  const irc:IRC = val as IRC;
  if (irc.body.alert) {
    console.log(irc.body);
    process.exit(1);
  }
  dbParties[party.identities[0].name] = irc.body.data as IParty;
  return irc.body.data;
};

export const seed = async (parties:BParty[]) => {
  await Promise.all(parties.map(createParty));
  parties.forEach(async (party) => {
    await Promise.all(party.i_can_act_for.map(async (rel) => {
      await addRelationship(rel, party, 'delegate');
    }));
    await Promise.all(party.can_act_for_me.map(async (rel) => {
      await addRelationship(rel, party, 'subject');
    }));
  });
};