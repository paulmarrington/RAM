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
        attributes: {}
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
        const res = await rest.promisify(rest.post('relationship', rel));
        list.push(res.body.data);
    }
    return list;
};

describe('RAM Relationship', () => {
    it('can be created', async (done) => {
        const rels = await generateRelationships(1);
        expect(rels[0]._id);
        done();
    });

    it('can retrieve a relationship by ID', async (done) => {
        const rels = await generateRelationships(1);
        const res = await rest.promisify(rest.get('relationship/' + rels[0]._id));
        expect(rels[0]._id).toEqual(res.body.data._id);
        done();
    });
    
    // Fixme: This test must use identityValue/identityType to retrive relationship belonging to a delegate
    // it('can list relationships', async (done) => {
    //     const rels = await generateRelationships(12);
    //     const res = await rest.promisify(rest.get('relationship/list/delegate/' +
    //         rels[0].delegateId + '/page/1/size/20'));
    //     expect(res.body.data.length).toEqual(12);
    //     done();
    // });
});

// describe('RAM Relationship again', () => {
    //     Fixme: This test must use identityValue/identityType to retrive relationship belonging to a delegate
    //     it('can load tables required by UI', async (done) => {
    //         const rels = await generateRelationships(12);
    //         const url = 'relationship/table/delegate/' +
    //             rels[0].delegateIdentityValue + '/' + rels[0].delegateIdentityType + '/page/1/size/20';
    //         const res = await rest.promisify(rest.get(url));
    //         expect(res.body.data.table.length).toEqual(12);
    //         done();
    //     });
// });
