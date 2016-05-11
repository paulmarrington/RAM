import * as faker from 'faker';

export class FakerTestHelper {
    public static fakeCompanyNameGenerator() {
        return {
            givenName: '',
            familyName: '',
            unstructuredName: FakerTestHelper.shortBusinessName()
        };
    };

    public static fakeABNGenerator() {
        return faker.random.number({ min: 10000000000, max: 99999999999 }).toString();
    }

    public static fakeIdentityNameGenerator() {
        return {
            givenName: FakerTestHelper.firstName(),
            familyName: FakerTestHelper.lastName(),
            unstructuredName: ''
        };
    };

    public static fakeJobArea() {
        return faker.name.jobArea();
    };

    public static longBusinessName() {
        return 'A longish business name for the trust entity of another trusting bunch of people';
    };

    public static firstName() {
        return faker.name.firstName();
    }
    public static lastName() {
        return faker.name.lastName();
    }
    public static shortBusinessName() {
        return faker.company.companyName();
    }

    public static companyNameWithPostfix(postfix: string) {
        return () => FakerTestHelper.shortBusinessName() + postfix;
    };

    public static randomRelationshipType() {
        return faker.random.arrayElement([
            'Business', 'Online Service Provider'
        ]);
    }
    public static generateUUID() {
        return faker.random.uuid();
    }
}