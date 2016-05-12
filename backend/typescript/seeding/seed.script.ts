/// <reference path="../../typings/main.d.ts" />
import * as agent from 'superagent';
import {
  IResponse, IName, IIdentity, IParty, IRelationship
} from '../../../commons/RamAPI';

const post =
(url: string, body: Object):Promise<agent.Response> => {
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

interface ISeedRelationship {
  relationship?:  string;
  status?:        string;
  name?:          string;
  nick_name?:     string;
  access_level?:  string;
}

interface ISeedIdentity {
  _id?:   string;
  type:   string;
  value:  string;
  name:   string;
  unstructuredName?: string;
}

export interface ISeedParty {
  roles?:         [string];
  attributes?:    {};
  identities:     [ISeedIdentity];
  iCanActFor?: [ISeedRelationship];
  canActForMe?:[ISeedRelationship];
}

const addRoles = (party:ISeedParty) => party.roles || [] as [string];
const addAttributes = (party:ISeedParty) => party.attributes || {};
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
};
const addIdentities = (party:ISeedParty) : IIdentity[] =>
  party.identities.map((identity:ISeedIdentity) : IIdentity => {
    return {
      type:   identity.type,
      value:  identity.value,
      name:   buildName(identity.type, identity.name)
    };
  });

const dbParties: {[name:string]:IParty} = {};

const buildRelaltionshipDocument = (rel:ISeedRelationship) => {
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

const postRelationship = async (doc: IRelationship) => {
  const val = await post('relationship', doc);
  if (val.body.alert) {
    console.log(val.body);
    process.exit(1);
  }
  return val.body.data;
};

const getDBParty = (name:string) => {
  const party = dbParties[name];
  if (!party) {
    console.log('No target party for ', name);
    process.exit(2);
  }
  return party;
};

const updatingRelationshipForSubject =
(doc: IRelationship, rel: ISeedRelationship,
 myParty: IParty,  theirParty: IParty) => {
  doc.delegateId = myParty._id;
  doc.subjectId = theirParty._id;
  if (theirParty.identities[0].type === 'abn') {
    doc.subjectAbn = theirParty.identities[0].value;
  }
  if (myParty.identities[0].type === 'abn') {
    doc.delegateAbn = myParty.identities[0].value;
  }
  doc.subjectName = rel.name;
  doc.delegateName = myParty.identities[0].name.unstructuredName;
  doc.subjectRole = rel.relationship || 'Unknown';
  if (myParty.roles.length > 0) {
    doc.delegateRole = myParty.roles[0];
  } else {
    doc.delegateRole = 'Guesswork';
  }
  if (rel.nick_name) {
    doc.subjectNickName = rel.nick_name;
  }
};

const updatingRelationshipForDelegate =
(doc: IRelationship, rel: ISeedRelationship,
 myParty: IParty,  theirParty: IParty) => {
    doc.subjectId = myParty._id;
    doc.delegateId = theirParty._id;
    if (theirParty.identities[0].type === 'abn') {
      doc.delegateAbn = theirParty.identities[0].value;
    }
    if (myParty.identities[0].type === 'abn') {
      doc.subjectAbn = myParty.identities[0].value;
    }
    doc.delegateName = rel.name;
    doc.subjectName = myParty.identities[0].name.unstructuredName;
    doc.delegateRole = rel.relationship || 'Unknown';
    if (myParty.roles.length > 0) {
      doc.subjectRole = myParty.roles[0];
    } else {
      doc.subjectRole = 'Guesswork';
    }
    if (rel.nick_name) {
      doc.delegateNickName = rel.nick_name;
    }
};
const addRelationship =
async (rel:ISeedRelationship, seedParty:ISeedParty, subdel:string) => {
  const myParty = dbParties[seedParty.identities[0].name];
  const theirParty = getDBParty(rel.name);
  const doc:IRelationship = buildRelaltionshipDocument(rel);

  if (subdel === 'subject') {
    updatingRelationshipForSubject(doc, rel, myParty, theirParty);
  } else {
    updatingRelationshipForDelegate(doc, rel, myParty, theirParty);
  }
  return postRelationship(doc);
};

const createParty = async (party:ISeedParty) => {
  const val:agent.Response = await post('party', {
    roles:      addRoles(party),
    attributes: addAttributes(party),
    identities: addIdentities(party)
  });
  const response:IResponse<IParty> = val.body;
  if (response.alert) {
    console.log(response);
    process.exit(1);
  }
  return dbParties[party.identities[0].name] = response.data;
};

export const seed = async (parties:ISeedParty[]) => {
  await Promise.all(parties.map(createParty));
  parties.forEach(async (party) => {
    await Promise.all(party.iCanActFor.map(async (rel) => {
      await addRelationship(rel, party, 'delegate');
    }));
    await Promise.all(party.canActForMe.map(async (rel) => {
      await addRelationship(rel, party, 'subject');
    }));
  });
};