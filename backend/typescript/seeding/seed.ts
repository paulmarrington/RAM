import * as mongoose from 'mongoose';
import * as colors from 'colors';
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

const truncateString = (input:String):String => {
    return input && input.length > 20 ? (input.substring(0, 20) + '...') : input;
};

// seeder .............................................................................................................

class Seeder {

    public static async connect() {
        await mongoose.connect(conf.mongoURL);
        console.log(`\nConnected to the db: ${conf.mongoURL}`);
    }

    public static async dropDatabase() {
        if (conf.devMode) {
            console.log('Dropping database in dev mode (starting fresh)');
            await mongoose.connection.db.dropDatabase();
        } else {
            console.log('Not dropping database in prod mode (appending)');
        }
    }

    public static async disconnect() {
        mongoose.connection.close();
    }

    public static async createRelationshipAttributeNameModel(values:IRelationshipAttributeName) {
        const code = values.code;
        const existingModel = await RelationshipAttributeNameModel.findByCodeIgnoringDateRange(code);
        if (existingModel === null) {
            console.log(colors.green(`- ${code}`));
            const model = await RelationshipAttributeNameModel.create(values);
            return model;
        } else {
            console.log(colors.green(`- ${code} ... skipped`));
            return existingModel;
        }
    }

    public static async createRelationshipAttributeNameUsageModels
    <T extends { attribute:IRelationshipAttributeName, optionalInd:boolean, defaultValue:string}>(attributeValues:T[]) {
        const attributeNameUsages:IRelationshipAttributeNameUsage[] = [];
        if (attributeValues) {
            for (let i = 0; i < attributeValues.length; i = i + 1) {
                const attributeValue = attributeValues[i];
                const truncatedDefaultValue = truncateString(attributeValue.defaultValue);
                console.log(colors.green(`  - ${attributeValue.attribute.code} (${truncatedDefaultValue})`));
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
            console.log(colors.magenta(`- ${code}`));
            values.attributeNameUsages = await Seeder.createRelationshipAttributeNameUsageModels(attributeValues);
            const model = await RelationshipTypeModel.create(values);
            console.log('');
            return model;
        } else {
            console.log(colors.magenta(`- ${code} ... skipped`));
            return existingModel;
        }
    }

    public static async createSharedSecretTypeModel(values:ISharedSecretType) {
        const code = values.code;
        const existingModel = await SharedSecretTypeModel.findByCodeIgnoringDateRange(code);
        if (existingModel === null) {
            console.log(colors.red(`- ${code}`));
            const model = await SharedSecretTypeModel.create(values);
            return model;
        } else {
            console.log(colors.red(`- ${code} ...`));
            return existingModel;
        }
    } 

}

// load reference data ................................................................................................

/* tslint:disable:max-func-body-length */
const loadReferenceData = async () => {

    try {

        // relationship attribute names (other) .......................................................................

        console.log('\nInserting Relationship Attribute Names (other):\n');

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

        // relationship attribute names (permission) ..................................................................

        const full_permissionAccess = 'Full access';
        const permissionPermittedAccessLevels = [full_permissionAccess, 'Limited access', 'No access'];

        const administrativeServices_category = 'Administrative Services';

        const asic_abn_attributeName = await Seeder.createRelationshipAttributeNameModel({
            code: 'ASIC_ABN_PERMISSION',
            shortDecodeText: 'Australian Securities and Investments Commission (ASIC)',
            longDecodeText: 'ABN / BN Project (limited release)',
            startDate: now,
            domain: RelationshipAttributeNameDomain.SelectSingle.name,
            classifier: RelationshipAttributeNameClassifier.Permission.name,
            category: administrativeServices_category,
            purposeText: 'A permission for a relationship',
            permittedValues: permissionPermittedAccessLevels
        } as IRelationshipAttributeName);

        const wgea_activate_attributeName = await Seeder.createRelationshipAttributeNameModel({
            code: 'WGEA_ACTIVATE_PERMISSION',
            shortDecodeText: 'Workplace Gender Equality Agency (WGEA)',
            longDecodeText: 'Activate',
            startDate: now,
            domain: RelationshipAttributeNameDomain.SelectSingle.name,
            classifier: RelationshipAttributeNameClassifier.Permission.name,
            category: administrativeServices_category,
            purposeText: 'A permission for a relationship',
            permittedValues: permissionPermittedAccessLevels
        } as IRelationshipAttributeName);

        const deptindustry_aba_attributeName = await Seeder.createRelationshipAttributeNameModel({
            code: 'DEPTOFINDUSTRY_ABA_PERMISSION',
            shortDecodeText: 'Department of Industry',
            longDecodeText: 'Australian Business Account (ABA) - ABLIS',
            startDate: now,
            domain: RelationshipAttributeNameDomain.SelectSingle.name,
            classifier: RelationshipAttributeNameClassifier.Permission.name,
            category: administrativeServices_category,
            purposeText: 'A permission for a relationship',
            permittedValues: permissionPermittedAccessLevels
        } as IRelationshipAttributeName);

        const abr_abr_attributeName = await Seeder.createRelationshipAttributeNameModel({
            code: 'ABR_ABR_PERMISSION',
            shortDecodeText: 'Australian Business Register (ABR)',
            longDecodeText: 'Australian Business Register',
            startDate: now,
            domain: RelationshipAttributeNameDomain.SelectSingle.name,
            classifier: RelationshipAttributeNameClassifier.Permission.name,
            category: administrativeServices_category,
            purposeText: 'A permission for a relationship',
            permittedValues: permissionPermittedAccessLevels
        } as IRelationshipAttributeName);

        const deptindustry_ats_attributeName = await Seeder.createRelationshipAttributeNameModel({
            code: 'DEPTOFINDUSTRY_ATS_PERMISSION',
            shortDecodeText: 'Department of Industry',
            longDecodeText: 'Automotive Transformation Scheme (ATS)',
            startDate: now,
            domain: RelationshipAttributeNameDomain.SelectSingle.name,
            classifier: RelationshipAttributeNameClassifier.Permission.name,
            category: administrativeServices_category,
            purposeText: 'A permission for a relationship',
            permittedValues: permissionPermittedAccessLevels
        } as IRelationshipAttributeName);

        const ntdeptbusiness_avetmiss_attributeName = await Seeder.createRelationshipAttributeNameModel({
            code: 'NTDEPTOFBUSINESS_AVETMISS_PERMISSION',
            shortDecodeText: 'NT Department of Business',
            longDecodeText: 'AVETMISS Training Portal',
            startDate: now,
            domain: RelationshipAttributeNameDomain.SelectSingle.name,
            classifier: RelationshipAttributeNameClassifier.Permission.name,
            category: administrativeServices_category,
            purposeText: 'A permission for a relationship',
            permittedValues: permissionPermittedAccessLevels
        } as IRelationshipAttributeName);

        const ntdeptcorpinfoservices_ims_attributeName = await Seeder.createRelationshipAttributeNameModel({
            code: 'NTDEPTOFCORPINFOSERVICES_IMS_PERMISSION',
            shortDecodeText: 'NT Department of Corporate & Information Services - DCIS',
            longDecodeText: 'Identity Management System (IMS) - Invoice Portal – Invoice NTG',
            startDate: now,
            domain: RelationshipAttributeNameDomain.SelectSingle.name,
            classifier: RelationshipAttributeNameClassifier.Permission.name,
            category: administrativeServices_category,
            purposeText: 'A permission for a relationship',
            permittedValues: permissionPermittedAccessLevels
        } as IRelationshipAttributeName);

        const depthumanservicescentrelink_ppl_attributeName = await Seeder.createRelationshipAttributeNameModel({
            code: 'DEPTOFHUMANSERVICESCENTRELINK_PPL_PERMISSION',
            shortDecodeText: 'Department of Human Services - Centrelink',
            longDecodeText: 'Paid Parental Leave',
            startDate: now,
            domain: RelationshipAttributeNameDomain.SelectSingle.name,
            classifier: RelationshipAttributeNameClassifier.Permission.name,
            category: administrativeServices_category,
            purposeText: 'A permission for a relationship',
            permittedValues: permissionPermittedAccessLevels
        } as IRelationshipAttributeName);

        const deptimmigration_skillselect_attributeName = await Seeder.createRelationshipAttributeNameModel({
            code: 'DEPTOFIMMIGRATION_SKILLSELECT_PERMISSION',
            shortDecodeText: 'Department of Immigration and Border Protection',
            longDecodeText: 'Skill Select',
            startDate: now,
            domain: RelationshipAttributeNameDomain.SelectSingle.name,
            classifier: RelationshipAttributeNameClassifier.Permission.name,
            category: administrativeServices_category,
            purposeText: 'A permission for a relationship',
            permittedValues: permissionPermittedAccessLevels
        } as IRelationshipAttributeName);

        const deptemployment_wageconnect_attributeName = await Seeder.createRelationshipAttributeNameModel({
            code: 'DEPTEMPLOYMENT_WAGECONNECT_PERMISSION',
            shortDecodeText: 'Department of Employment',
            longDecodeText: 'Wage Connect',
            startDate: now,
            domain: RelationshipAttributeNameDomain.SelectSingle.name,
            classifier: RelationshipAttributeNameClassifier.Permission.name,
            category: administrativeServices_category,
            purposeText: 'A permission for a relationship',
            permittedValues: permissionPermittedAccessLevels
        } as IRelationshipAttributeName);

        // relationship types .........................................................................................

        console.log('\nInserting Relationship Types:\n');

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
                defaultValue: 'Markdown for Subject Universal Representative Declaration'},
            {attribute: asic_abn_attributeName, optionalInd: false, defaultValue: full_permissionAccess},
            {attribute: wgea_activate_attributeName, optionalInd: false, defaultValue: full_permissionAccess},
            {attribute: deptindustry_aba_attributeName, optionalInd: false, defaultValue: full_permissionAccess},
            {attribute: abr_abr_attributeName, optionalInd: false, defaultValue: full_permissionAccess},
            {attribute: deptindustry_ats_attributeName, optionalInd: false, defaultValue: full_permissionAccess},
            {attribute: ntdeptbusiness_avetmiss_attributeName, optionalInd: false, defaultValue: full_permissionAccess},
            {attribute: ntdeptcorpinfoservices_ims_attributeName, optionalInd: false, defaultValue: full_permissionAccess},
            {attribute: depthumanservicescentrelink_ppl_attributeName, optionalInd: false, defaultValue: full_permissionAccess},
            {attribute: deptimmigration_skillselect_attributeName, optionalInd: false, defaultValue: full_permissionAccess},
            {attribute: deptemployment_wageconnect_attributeName, optionalInd: false, defaultValue: full_permissionAccess}
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
                defaultValue: 'Markdown for Subject Custom Representative Declaration'},
            {attribute: asic_abn_attributeName, optionalInd: false, defaultValue: null},
            {attribute: wgea_activate_attributeName, optionalInd: false, defaultValue: null},
            {attribute: deptindustry_aba_attributeName, optionalInd: false, defaultValue: null},
            {attribute: abr_abr_attributeName, optionalInd: false, defaultValue: null},
            {attribute: deptindustry_ats_attributeName, optionalInd: false, defaultValue: null},
            {attribute: ntdeptbusiness_avetmiss_attributeName, optionalInd: false, defaultValue: null},
            {attribute: ntdeptcorpinfoservices_ims_attributeName, optionalInd: false, defaultValue: null},
            {attribute: depthumanservicescentrelink_ppl_attributeName, optionalInd: false, defaultValue: null},
            {attribute: deptimmigration_skillselect_attributeName, optionalInd: false, defaultValue: null},
            {attribute: deptemployment_wageconnect_attributeName, optionalInd: false, defaultValue: null}
        ]);

        // shared secret types ............................................................................................

        console.log('\nInserting Shared Secret Types:\n');

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