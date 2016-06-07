import * as mongoose from 'mongoose';
import {RAMEnum, IRAMObject, RAMSchema} from './base';
import {IProfile, ProfileModel} from './profile.model';

// force schema to load first (see https://github.com/atogov/RAM/pull/220#discussion_r65115456)

/* tslint:disable:no-unused-variable */
const _ProfileModel = ProfileModel;

// enums, utilities, helpers ..........................................................................................

export class IdentityType extends RAMEnum {

    public static AgencyProvidedToken = new IdentityType('AGENCY_PROVIDED_TOKEN');
    public static InvitationCode = new IdentityType('INVITATION_CODE');
    public static LinkId = new IdentityType('LINK_ID');
    public static PublicIdentifier = new IdentityType('PUBLIC_IDENTIFIER');

    protected static AllValues = [
        IdentityType.AgencyProvidedToken,
        IdentityType.InvitationCode,
        IdentityType.LinkId,
        IdentityType.PublicIdentifier
    ];

    constructor(name:String) {
        super(name);
    }
}

export class IdentityInvitationCodeStatus extends RAMEnum {

    public static Claimed = new IdentityInvitationCodeStatus('CLAIMED');
    public static Pending = new IdentityInvitationCodeStatus('PENDING');

    protected static AllValues = [
        IdentityInvitationCodeStatus.Claimed,
        IdentityInvitationCodeStatus.Pending
    ];

    constructor(name:String) {
        super(name);
    }
}

export class IdentityAgencyScheme extends RAMEnum {

    public static Medicare = new IdentityAgencyScheme('MEDICARE');

    protected static AllValues = [
        IdentityAgencyScheme.Medicare
    ];

    constructor(name:String) {
        super(name);
    }
}

export class IdentityPublicIdentifierScheme extends RAMEnum {

    public static ABN = new IdentityPublicIdentifierScheme('ABN');

    protected static AllValues = [
        IdentityPublicIdentifierScheme.ABN
    ];

    constructor(name:String) {
        super(name);
    }
}

export class IdentityLinkIdScheme extends RAMEnum {

    public static AuthenticatorApp = new IdentityPublicIdentifierScheme('AUTHENTICATOR_APP');
    public static MyGov = new IdentityPublicIdentifierScheme('MY_GOV');
    public static Vanguard = new IdentityPublicIdentifierScheme('VANGUARD');

    protected static AllValues = [
        IdentityLinkIdScheme.AuthenticatorApp,
        IdentityLinkIdScheme.MyGov,
        IdentityLinkIdScheme.Vanguard
    ];

    constructor(name:String) {
        super(name);
    }
}

// schema .............................................................................................................

const IdentitySchema = RAMSchema({
    idValue: {
        type: String,
        required: [true, 'Id Value is required'],
        trim: true
    },
    identityType: {
        type: String,
        required: [true, 'Type is required'],
        trim: true,
        enum: IdentityType.valueStrings()
    },
    defaultInd: {
        type: Boolean,
        required: [true, 'Default Indicator is required'],
        default: false
    },
    agencyToken: {
        type: String,
        trim: true,
        required: [function () {
            return this.identityType === IdentityType.AgencyProvidedToken.name;
        }, 'Agency Token is required']
    },
    invitationCodeStatus: {
        type: String,
        trim: true,
        required: [function () {
            return this.identityType === IdentityType.InvitationCode.name;
        }, 'Invitation Code Status is required'],
        enum: IdentityInvitationCodeStatus.valueStrings()
    },
    invitationCodeExpiryTimestamp: {
        type: Date,
        required: [function () {
            return this.identityType === IdentityType.InvitationCode.name;
        }, 'Invitation Code Expiry is required']
    },
    invitationCodeClaimedTimestamp: {
        type: Date,
        required: [function () {
            return this.identityType === IdentityType.InvitationCode.name &&
                this.invitationCodeStatus === IdentityInvitationCodeStatus.Claimed.name;
        }, 'Invitation Code Claimed Timestamp is required']
    },
    invitationCodeTemporaryEmailAddress: {
        type: String,
        trim: true
    },
    agencyScheme: {
        type: String,
        trim: true,
        required: [function () {
            return this.identityType === IdentityType.AgencyProvidedToken.name;
        }, 'Agency Scheme is required'],
        enum: IdentityAgencyScheme.valueStrings()
    },
    publicIdentifierScheme: {
        type: String,
        trim: true,
        required: [function () {
            return this.identityType === IdentityType.PublicIdentifier.name;
        }, 'Public Identifier Scheme is required'],
        enum: IdentityPublicIdentifierScheme.valueStrings()
    },
    linkIdScheme: {
        type: String,
        trim: true,
        required: [function () {
            return this.identityType === IdentityType.LinkId.name;
        }, 'Link Id Scheme is required'],
        enum: IdentityLinkIdScheme.valueStrings()
    },
    linkIdConsumer: {
        type: String,
        trim: true
    },
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        required: [true, 'Profile is required']
    }
});

// interfaces .........................................................................................................

export interface IIdentity extends IRAMObject {
    idValue: string;
    identityType: string;
    defaultInd: boolean;
    agencyToken: string;
    invitationCodeStatus: string;
    invitationCodeExpiryTimestamp: Date;
    invitationCodeClaimedTimestamp: Date;
    invitationCodeTemporaryEmailAddress: string;
    publicIdentifierScheme: string;
    linkIdScheme: string;
    linkIdConsumer: string;
    profile: IProfile;
    identityTypeEnum(): IdentityType;
    invitationCodeStatusEnum(): IdentityInvitationCodeStatus;
    publicIdentifierSchemeEnum(): IdentityPublicIdentifierScheme;
    linkIdSchemeEnum(): IdentityLinkIdScheme;
}

export interface IIdentityModel extends mongoose.Model<IIdentity> {
    findByIdValueAndType: (idValue:String, type:IdentityType) => mongoose.Promise<IIdentity>;
}

// instance methods ...................................................................................................

IdentitySchema.method('identityTypeEnum', function () {
    return IdentityType.valueOf(this.identityType);
});

IdentitySchema.method('invitationCodeStatusEnum', function () {
    return IdentityInvitationCodeStatus.valueOf(this.invitationCodeStatus);
});

IdentitySchema.method('publicIdentifierSchemeEnum', function () {
    return IdentityPublicIdentifierScheme.valueOf(this.publicIdentifierScheme);
});

IdentitySchema.method('linkIdSchemeEnum', function () {
    return IdentityLinkIdScheme.valueOf(this.linkIdScheme);
});

// static methods .....................................................................................................

IdentitySchema.static('findByIdValueAndType', (idValue:String, type:IdentityType) => {
    return this.IdentityModel
        .findOne({
            idValue: idValue,
            identityType: type.name
        })
        .deepPopulate([
            'profile.name',
            'profile.sharedSecrets.sharedSecretType'
        ])
        .exec();
});

// concrete model .....................................................................................................

export const IdentityModel = mongoose.model(
    'Identity',
    IdentitySchema) as IIdentityModel;
