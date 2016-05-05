import * as faker from 'faker';

export class FakerTestHelper {
    public static fakeCompanyNameGenerator() {
        return {
            givenName: '',
            familyName: '',
            unstructuredName: faker.company.companyName()
        };
    };

    public static fakeABNGenerator() {
        return faker.random.number({ min: 10000000000, max: 99999999999 }).toString();
    }

    public static fakeIdentityNameGenerator() {
        return {
            givenName: faker.name.firstName(),
            familyName: faker.name.lastName(),
            unstructuredName: ''
        };
    };

    public static fakeJobArea() {
        return faker.name.jobArea();
    }
    
}