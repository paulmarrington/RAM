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
    };

    public static aLongBusinessName() {
        return 'A longish business name for the trust entity of another trusting bunch of people';
    };

    public static firstName() {
        return faker.name.firstName();
    }
    public static aShortBusinessName() {
        return faker.company.companyName();
    };
    public static aBizWhoGaveYouFullAccess() {
        return faker.company.companyName();
    };
    public static aBizWhoGaveYouLimitedAccess() {
        return faker.company.companyName();
    };
    public static b2bBusinessThatHasTrustsInMind() {
        return faker.company.companyName() + ' Trustees';
    };
    public static cloudSoftwareForUSI() {
        return faker.company.companyName() + ' Clouds';
    };

    public static randomRelationshipType() {
        return faker.random.arrayElement['Business', 'Online Service Provider'];
    }
    public static generateUUID() {
        return faker.random.uuid();
    }
}