import RelationshipHelper from './helpers/relationshipHelper';
import InitializationHelper from './helpers/initializationHelper';

const relationshipHelper = new RelationshipHelper();
const initializationHelper = new InitializationHelper();

/* tslint:disable:max-func-body-length */
describe('Relationship API', () => {
    const known_identity_jen:string = 'LINK_ID:MY_GOV:jennifermaxims_identity_1';
    const known_identity_jens_catering:string = 'PUBLIC_IDENTIFIER:ABN:jenscatering_identity_1';

    beforeAll(async(done) => {
        try {
            await initializationHelper.loadData();
        } catch (e) {
            fail(e);
        }
        done();
    });

    afterAll((done) => {
        done();
    });

    it('can list by subject', async(done) => {

        try {

            const response = await relationshipHelper.subject(known_identity_jens_catering, 1, 10);
            relationshipHelper.validateRelationshipList(response.body.list);

        } catch (e) {
            fail(e);
        }

        done();
    });

    it('can list by delegate', async(done) => {

            try {

                const response = await relationshipHelper.delegate(known_identity_jen, 1, 10);
                relationshipHelper.validateRelationshipList(response.body.list);

            } catch (e) {
                fail(e);
            }

            done();
        });
});

