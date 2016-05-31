import * as mongoose from 'mongoose';
import {conf} from '../bootstrap';

import {
    IRelationshipAttributeName,
    RelationshipAttributeNameModel,
    RelationshipAttributeNameStringDomain,
    RelationshipAttributeNameSingleSelectDomain} from '../models/relationshipAttributeName.model';
import {IRelationshipAttributeNameUsage, RelationshipAttributeNameUsageModel} from '../models/relationshipAttributeNameUsage.model';
import {IRelationshipType, RelationshipTypeModel} from '../models/relationshipType.model';

const now = new Date();

// seeder .............................................................................................................

class Seeder {

    public static async connect() {
        await mongoose.connect(conf.mongoURL);
        console.log('\nConnected to the db: ', conf.mongoURL);
    }

    public static async dropDatabase() {
        if (conf.devMode) {
            console.info('Dropping database in dev mode (starting fresh)');
            await mongoose.connection.db.dropDatabase();
        } else {
            console.info('Not dropping database in prod mode (appending)');
        }
    }

    public static async disconnect() {
        mongoose.connection.close();
    }

    /* tslint:disable:max-func-body-length */
    public static async createRelationshipAttributeNameModel(values:IRelationshipAttributeName) {
        const code = values.code;
        const existingModel = await RelationshipAttributeNameModel.findByCodeIgnoringDateRange(code);
        if (existingModel === null) {
            console.log('-', code);
            const model = await RelationshipAttributeNameModel.create(values);
            return model;
        } else {
            console.log('-', code, ' ... skipped');
            return existingModel;
        }
    }

    /* tslint:disable:max-func-body-length */
    public static async createRelationshipTypeModel(values:IRelationshipType,attributeNames:IRelationshipAttributeName[]) {

        const code = values.code;
        const existingModel = await RelationshipTypeModel.findByCodeIgnoringDateRange(code);

        if (existingModel === null) {

            console.log('-', code);

            const attributeNameUsages:IRelationshipAttributeNameUsage[] = [];

            if (attributeNames) {
                for (let i = 0; i < attributeNames.length; i = i+1) {
                    const attributeName = attributeNames[i];
                    const attributeNameUsage = await RelationshipAttributeNameUsageModel.create({
                        optionalInd: true,
                        attributeName: attributeName
                    });
                    attributeNameUsages.push(attributeNameUsage);
                }
            }

            values.attributeNameUsages = attributeNameUsages;

            const model = await RelationshipTypeModel.create(values);
            return model;

        } else {
            console.log('-', code, ' ... skipped');
            return existingModel;
        }
    }

}

// load reference data ................................................................................................

/* tslint:disable:max-func-body-length */
const loadReferenceData = async () => {

    // relationship attribute names

    console.log('\nInserting Relationship Attribute Names:');

    const employeeNumber_attributeName = await Seeder.createRelationshipAttributeNameModel({
        code: 'EMPLOYEE_NUMBER',
        shortDecodeText: 'Employee Number',
        longDecodeText: 'Employee Number',
        startDate: now,
        domain: RelationshipAttributeNameStringDomain,
        purposeText: 'Employee Number'
    } as IRelationshipAttributeName);

    const employmentType_attributeName = await Seeder.createRelationshipAttributeNameModel({
        code: 'EMPLOYMENT_TYPE',
        shortDecodeText: 'Employment Type',
        longDecodeText: 'Employment Type',
        startDate: now,
        domain: RelationshipAttributeNameSingleSelectDomain,
        purposeText: 'Employee Type',
        permittedValues: ['Permanent', 'Contractor', 'Casual']
    } as IRelationshipAttributeName);

    // relationship types

    console.log('\nInserting Relationship Types:');

    await Seeder.createRelationshipTypeModel({
        code: 'BUSINESS_REPRESENTATIVE',
        shortDecodeText: 'Business Representative',
        longDecodeText: 'Business Representative',
        startDate: now
    } as IRelationshipType, [employeeNumber_attributeName, employmentType_attributeName]);

    await Seeder.createRelationshipTypeModel({
        code: 'ONLINE_SERVICE_PROVIDER',
        shortDecodeText: 'Online Service Provider',
        longDecodeText: 'Online Service Provider',
        startDate: now
    } as IRelationshipType, null);

    await Seeder.createRelationshipTypeModel({
        code: 'INSOLVENCY_PRACTITIONER',
        shortDecodeText: 'Insolvency Practitioner',
        longDecodeText: 'Insolvency Practitioner',
        startDate: now
    } as IRelationshipType, null);

    await Seeder.createRelationshipTypeModel({
        code: 'TRUSTED_INTERMEDIARY',
        shortDecodeText: 'Trusted Intermediary - tax agent, BAS Agent, Financial Advisor, Lawyer',
        longDecodeText: 'Trusted Intermediary - tax agent, BAS Agent, Financial Advisor, Lawyer',
        startDate: now
    } as IRelationshipType, null);

    await Seeder.createRelationshipTypeModel({
        code: 'INTERMEDIARY',
        shortDecodeText: 'Intermediary – Real Estate Agent, Immigration Agent',
        longDecodeText: 'Intermediary – Real Estate Agent, Immigration Agent',
        startDate: now
    } as IRelationshipType, null);

    await Seeder.createRelationshipTypeModel({
        code: 'IMPORTER_EXPORT_AGENT',
        shortDecodeText: 'Importer Export Agent',
        longDecodeText: 'Importer Export Agent',
        startDate: now
    } as IRelationshipType, null);

    await Seeder.createRelationshipTypeModel({
        code: 'DOCTOR_PATIENT',
        shortDecodeText: 'Doctor Patient',
        longDecodeText: 'Doctor Patient',
        startDate: now
    } as IRelationshipType, null);

    await Seeder.createRelationshipTypeModel({
        code: 'NOMINATED_ENTITY',
        shortDecodeText: 'Nominated Entity',
        longDecodeText: 'Nominated Entity',
        startDate: now
    } as IRelationshipType, null);

    await Seeder.createRelationshipTypeModel({
        code: 'POWER_OF_ATTORNEY_VOLUNTARY',
        shortDecodeText: 'Power of Attorney (Voluntary)',
        longDecodeText: 'Power of Attorney (Voluntary)',
        startDate: now
    } as IRelationshipType, null);

    await Seeder.createRelationshipTypeModel({
        code: 'POWER_OF_ATTORNEY_INVOLUNTARY',
        shortDecodeText: 'Power of Attorney (Involuntary)',
        longDecodeText: 'Power of Attorney (Involuntary)',
        startDate: now
    } as IRelationshipType, null);

    await Seeder.createRelationshipTypeModel({
        code: 'EXECUTOR_OF_DECEASED_ESTATE',
        shortDecodeText: 'Executor of Deceased Estate',
        longDecodeText: 'Executor of Deceased Estate',
        startDate: now
    } as IRelationshipType, null);

    await Seeder.createRelationshipTypeModel({
        code: 'PHARMACEUTICAL',
        shortDecodeText: 'Pharmaceutical',
        longDecodeText: 'Pharmaceutical',
        startDate: now
    } as IRelationshipType, null);

    await Seeder.createRelationshipTypeModel({
        code: 'INSTITUTION_TO_STUDENT',
        shortDecodeText: 'Institution to student – relationship',
        longDecodeText: 'Institution to student – relationship',
        startDate: now
    } as IRelationshipType, null);

    await Seeder.createRelationshipTypeModel({
        code: 'RTO',
        shortDecodeText: 'Training organisations (RTO)',
        longDecodeText: 'Training organisations (RTO)',
        startDate: now
    } as IRelationshipType, null);

    await Seeder.createRelationshipTypeModel({
        code: 'PARENT_CHILD',
        shortDecodeText: 'Parent - Child',
        longDecodeText: 'Parent - Child',
        startDate: now
    } as IRelationshipType, null);

    await Seeder.createRelationshipTypeModel({
        code: 'EMPLOYMENT_AGENT_EMPLOYMENT',
        shortDecodeText: 'Employment Agents – employment',
        longDecodeText: 'Employment Agents – employment',
        startDate: now
    } as IRelationshipType, null);

};

// load sample data ...................................................................................................

// rock and roll ......................................................................................................

Seeder
    .connect()
    .then(Seeder.dropDatabase)
    .then(loadReferenceData)
    .then(Seeder.disconnect);