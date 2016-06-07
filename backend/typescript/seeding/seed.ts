import * as mongoose from 'mongoose';
import {conf} from '../bootstrap';

import {
    IRelationshipAttributeName,
    RelationshipAttributeNameModel,
    RelationshipAttributeNameDomain,
    RelationshipAttributeNameClassifier} from '../models/relationshipAttributeName.model';

import {
    IRelationshipAttributeNameUsage,
    RelationshipAttributeNameUsageModel} from '../models/relationshipAttributeNameUsage.model';

import {
    IRelationshipType,
    RelationshipTypeModel} from '../models/relationshipType.model';

import {
    ISharedSecretType,
    SharedSecretTypeModel} from '../models/sharedSecretType.model';

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

    public static async createRelationshipAttributeNameUsageModels
    <T extends { attribute:IRelationshipAttributeName, optionalInd:boolean, defaultValue:string}>(attributeValues:T[]) {
        const attributeNameUsages:IRelationshipAttributeNameUsage[] = [];
        if (attributeValues) {
            for (let i = 0; i < attributeValues.length; i = i+1) {
                const attributeValue = attributeValues[i];
                const attributeNameUsage = await RelationshipAttributeNameUsageModel.create({
                    attributeName: attributeValue.attribute,
                    optionalInd: attributeValue.optionalInd,
                    defaultValue: attributeValue.defaultValue
                });
                attributeNameUsages.push(attributeNameUsage);
            }
        }
        return attributeNameUsages;
    }

    public static async createRelationshipTypeModel
    <T extends { attribute:IRelationshipAttributeName, optionalInd:boolean, defaultValue:string}>
    (values:IRelationshipType, attributeValues:T[]) {
        const code = values.code;
        const existingModel = await RelationshipTypeModel.findByCodeIgnoringDateRange(code);
        if (existingModel === null) {
            console.log('-', code);
            values.attributeNameUsages = await Seeder.createRelationshipAttributeNameUsageModels(attributeValues);
            const model = await RelationshipTypeModel.create(values);
            return model;

        } else {
            console.log('-', code, ' ... skipped');
            return existingModel;
        }
    }

    public static async createSharedSecretTypeModel(values:ISharedSecretType) {
        const code = values.code;
        const existingModel = await SharedSecretTypeModel.findByCodeIgnoringDateRange(code);
        if (existingModel === null) {
            console.log('-', code);
            const model = await SharedSecretTypeModel.create(values);
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

    try {

        // relationship attribute names ...................................................................................

        console.log('\nInserting Relationship Attribute Names:');

        const permissionCustomisationAllowedInd_attributeName = await Seeder.createRelationshipAttributeNameModel({
            code: 'PERMISSION_CUSTOMISATION_ALLOWED_IND',
            shortDecodeText: 'Permission Customisation Allowed Indicator',
            longDecodeText: 'Permission Customisation Allowed Indicator',
            startDate: now,
            domain: RelationshipAttributeNameDomain.Boolean.name,
            classifier: RelationshipAttributeNameClassifier.Other.name,
            category: null,
            purposeText: 'Indicator of whether a relationship type allows the user to customise permission levels'
        } as IRelationshipAttributeName);

        const delegateManageAuthorisationAllowedInd_attributeName = await Seeder.createRelationshipAttributeNameModel({
            code: 'DELEGATE_MANAGE_AUTHORISATION_ALLOWED_IND',
            shortDecodeText: 'Delegate Manage Authorisations Allowed Indicator',
            longDecodeText: 'Delegate Manage Authorisations Allowed Indicator',
            startDate: now,
            domain: RelationshipAttributeNameDomain.Boolean.name,
            classifier: RelationshipAttributeNameClassifier.Other.name,
            category: null,
            purposeText: 'Indicator of whether a relationship allows the delegate to manage authorisations'
        } as IRelationshipAttributeName);

        const delegateRelationshipTypeDeclaration_attributeName = await Seeder.createRelationshipAttributeNameModel({
            code: 'DELEGATE_RELATIONSHIP_TYPE_DECLARATION',
            shortDecodeText: 'Delegate Relationship Type Declaration',
            longDecodeText: 'Delegate Relationship Type Declaration',
            startDate: now,
            domain: RelationshipAttributeNameDomain.Markdown.name,
            classifier: RelationshipAttributeNameClassifier.Other.name,
            category: null,
            purposeText: 'Delegate specific declaration in Markdown for a relationship type'
        } as IRelationshipAttributeName);

        const subjectRelationshipTypeDeclaration_attributeName = await Seeder.createRelationshipAttributeNameModel({
            code: 'SUBJECT_RELATIONSHIP_TYPE_DECLARATION',
            shortDecodeText: 'Subject Relationship Type Declaration',
            longDecodeText: 'Subject Relationship Type Declaration',
            startDate: now,
            domain: RelationshipAttributeNameDomain.Markdown.name,
            classifier: RelationshipAttributeNameClassifier.Other.name,
            category: null,
            purposeText: 'Subject specific declaration in Markdown for a relationship type'
        } as IRelationshipAttributeName);

        // relationship types .............................................................................................

        console.log('\nInserting Relationship Types:');

        await Seeder.createRelationshipTypeModel({
            code: 'UNIVERSAL_REPRESENTATIVE',
            shortDecodeText: 'Universal Representative',
            longDecodeText: 'Universal Representative',
            startDate: now
        } as IRelationshipType, [
            {attribute: permissionCustomisationAllowedInd_attributeName, optionalInd: false, defaultValue: 'false'},
            {attribute: delegateManageAuthorisationAllowedInd_attributeName, optionalInd: false, defaultValue: 'false'},
            {attribute: delegateRelationshipTypeDeclaration_attributeName, optionalInd: false,
                defaultValue: 'Markdown for Delegate Universal Representative Declaration'},
            {attribute: subjectRelationshipTypeDeclaration_attributeName, optionalInd: false,
                defaultValue: 'Markdown for Subject Universal Representative Declaration'}
        ]);

        await Seeder.createRelationshipTypeModel({
            code: 'CUSTOM_REPRESENTATIVE',
            shortDecodeText: 'Custom Representative',
            longDecodeText: 'Custom Representative',
            startDate: now
        } as IRelationshipType, [
            {attribute: permissionCustomisationAllowedInd_attributeName, optionalInd: false, defaultValue: 'true'},
            {attribute: delegateManageAuthorisationAllowedInd_attributeName, optionalInd: false, defaultValue: 'false'},
            {attribute: delegateRelationshipTypeDeclaration_attributeName, optionalInd: false,
                defaultValue: 'Markdown for Delegate Custom Representative Declaration'},
            {attribute: subjectRelationshipTypeDeclaration_attributeName, optionalInd: false,
                defaultValue: 'Markdown for Subject Custom Representative Declaration'}
        ]);

        // shared secret types ............................................................................................

        console.log('\nInserting Shared Secret Types:');

        await Seeder.createSharedSecretTypeModel({
            code: 'DATE_OF_BIRTH',
            shortDecodeText: 'Date of Birth',
            longDecodeText: 'Date of Birth',
            startDate: now,
            domain: 'DEFAULT'
        } as ISharedSecretType);

    } catch (e) {
        console.log('Seeding failed!');
        console.log(e);
    }

};

// load sample data ...................................................................................................

// rock and roll ......................................................................................................

Seeder
    .connect()
    .then(Seeder.dropDatabase)
    .then(loadReferenceData)
    .then(Seeder.disconnect);