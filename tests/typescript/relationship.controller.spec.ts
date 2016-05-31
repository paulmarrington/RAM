import {
    createNewPartyByABN
}  from './support/party';
import {RestCalls} from './support/rest';
import {FakerTestHelper} from './support/faker.test.helper';

const rest = new RestCalls('localhost', 3000);

const newRelationship = (party1, abn1, party2, abn2) => {
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 1000 * 60 * 60 * 24);
    return {
        type: FakerTestHelper.randomRelationshipType(),
        startTimestamp: now,
        endTimestamp: tomorrow,
        status: 'Active',
        subjectsNickName: FakerTestHelper.firstName(),
        delegatesNickName: FakerTestHelper.firstName(),
        attributes: {},
        delegateRole: 'bamboozled',
        subjectRole: 'sneezy',
        delegateId: party2._id,
        subjectId: party1._id
    };
};

const generateRelationships = async (count) => {
    const abn1 = FakerTestHelper.fakeABNGenerator();
    const abn2 = FakerTestHelper.fakeABNGenerator();
    const party1 = (await createNewPartyByABN(abn1)).body.data;
    const party2 = (await createNewPartyByABN(abn2)).body.data;
    const list = [];

    for (let i = 0; i < count; i += 1) {
        const rel = newRelationship(party1, abn1, party2, abn2);
        const res = await rest.promisify(rest.post('/v1/relationship', rel));
        list.push(res.body);
    }
    return list;
};

const lookForId = (obj) => {
 Object.keys(obj).forEach((key) => {
   const value = obj[key];
   if (value instanceof String && /^[\da-f]{24}/.test(value)) {
       fail('ID found for ' + key);
   }
 });
};

describe('RAM Relationship', () => {
    it('can be created', async (done) => {
        const rels = await generateRelationships(1);
        if (! rels[0].data) {
            fail(JSON.stringify(rels[0], null, 2));
        } else {
            expect(rels[0].data._id);
        }
        done();
    });

    it('can retrieve a relationship by ID', async (done) => {
        const rels = await generateRelationships(1);
        const res = await rest.promisify(rest.get('/v1/relationship/' + rels[0].data._id));
        expect(rels[0].data._id).toEqual(res.body.data._id);
        done();
    });
});

// describe('Relationship Internals', () => {

//     it('does not include any Mongo internal IDs', async (done) => {
//         const rel = await generateRelationships(1)[0];
//         lookForId(rel);
//         done();
//     })

//     it('has delegate and subject information populated', async (done) => {
//     })

    // Fixme: This test must use identityValue/identityType to retrive relationship belonging to a delegate
    // it('can list relationships', async (done) => {
    //     const rels = await generateRelationships(12);
    //     const res = await rest.promisify(rest.get('/v1/relationship/list/delegate/' +
    //         rels[0].delegateId + '/page/1/size/20'));
    //     expect(res.body.data.length).toEqual(12);
    //     done();
    // });
// });

// describe('RAM Relationship again', () => {
    //     Fixme: This test must use identityValue/identityType to retrive relationship belonging to a delegate
    //     it('can load tables required by UI', async (done) => {
    //         const rels = await generateRelationships(12);
    //         const url = '/v1/relationship/table/delegate/' +
    //             rels[0].delegateIdentityValue + '/' + rels[0].delegateIdentityType + '/page/1/size/20';
    //         const res = await rest.promisify(rest.get(url));
    //         expect(res.body.data.table.length).toEqual(12);
    //         done();
    //     });
// });
