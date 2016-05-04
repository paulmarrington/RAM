import {
  new_party, fake_abn, new_two_identity_party,
  get_party, update_party
}  from './support/party';
import * as faker from 'faker';
import {get, post, put} from './support/rest';

const random_relationship_type = () =>
  faker.random.arrayElement['Business', 'Online Service Provider']

const new_document = (party_1, abn_1, party_2, abn_2) => {
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 1000 * 60 * 60 * 12);
  return {
    type: random_relationship_type(),
    subjectId: party_1.identities[0]._id,
    subjectName: party_1.identities[0].name,
    subjectAbn: abn_1,
    subjectRole: faker.name.jobArea(),
    delegateId: party_2.identities[0]._id,
    delegateName: party_2.identities[0].name,
    delegateAbn: abn_2,
    delegateRole: faker.name.jobArea(),
    startTimestamp: now,
    endTimestamp: tomorrow,
    status: 'Active',
    subjectsNickName: faker.name.firstName(),
    delegatesNickName: faker.name.firstName(),
    attributes: { delegate_abn: abn_2 }
  };
};

const new_relationships = (count) => {
  return new Promise((resolve, reject) => {
    const abn_1 = fake_abn(), abn_2 = fake_abn();
    new_party(abn_1).then((party_1) => {
      new_party(abn_2).then((party_2) => {
        const list = [];
        const add_relationship = (counter) => {
          const doc = new_document(party_1, abn_1, party_2, abn_2);
          post("relationship", doc).then((res) => {
            list.push(res);
            if (!counter) resolve(list.length == 1 ? list[0] : list);
            else add_relationship(counter - 1);
          });
        }
        add_relationship(count - 1);
      });
    });
  });
};

describe('a RAM Relationship', () => {
  it('can be created', (done) => {
    new_relationships(1).then(rel => {
      expect(typeof rel._id).toBe("string");
      done();
    })
  })
  it('can retrieve a relationship by ID', (done) => {
    new_relationships(1).then(rel => {
      get('relationship/' + rel._id).then((res) => {
        expect(rel._id).toEqual(res._id);
        done();
      })
    })
  })
  it('can list relationships', (done) => {
    new_relationships(12).then(rels => {
      get('relationship/list/delegate/' +
        rels[0].delegateId + '/page/1/size/20')
        .then((res) => {
          expect(res.length).toEqual(12);
          done();
        })
    })
  })
})
describe('a RAM Relationship again', () => {
  it('can update a relationship', (done) => {
    new_relationships(1).then(rel => {
      const updates = { subjectRole: 'bletherer' };
      put('relationship/' + rel._id, updates)
        .then((res) => {
          expect(res.subjectRole).toEqual('bletherer');
          done();
        })
    })
  })
  // it("can load tables required by UI", function (done) {
  //   new_relationships(12).then(rels => {
  //     console.log(rels[0]);
  //     const url = "relationship/table/delegate/" +
  //       rels[0].delegateIdentityValue + "/" + rels[0].delegateIdentityType + "/page/1/size/20";
  //     console.log(url);
  //     rest.get(url)
  //       .then(function (res) {
  //         expect(res.table.length).toEqual(12)
  //         done()
  //       })
  //   })
  // })
});
