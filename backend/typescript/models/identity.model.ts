import * as mongoose from 'mongoose';
import {IRAMObject, RAMSchema} from './base';
import {IProfile, ProfileModel} from './profile.model';

// force schema to load first (see https://github.com/atogov/RAM/pull/220#discussion_r65115456)

/* tslint:disable:no-unused-variable */
const _ProfileModel = ProfileModel;

// enums, utilities, helpers ..........................................................................................

export class IdentityType {

    public static AgencyProvidedToken = new IdentityType('AGENCY_PROVIDED_TOKEN');
    public static InvitationCode = new IdentityType('INVITATION_CODE');
    public static LinkId = new IdentityType('LINK_ID');
    public static PublicIdentifier = new IdentityType('PUBLIC_IDENTIFIER');

    public static AllValues = [
        IdentityType.AgencyProvidedToken,
        IdentityType.InvitationCode,
        IdentityType.LinkId,
        IdentityType.PublicIdentifier
    ];

    public static values():IdentityType[] {
        return IdentityType.AllValues;
    }

    public static valueStrings():String[] {
        return IdentityType.AllValues.map((value) => value.name);
    }

    public static valueOf(name:String):IdentityType {
        for (let type of IdentityType.AllValues) {
            if (type.name === name) {
                return type;
            }
        }
        return null;
    }

    constructor(public name:String) {
    }
}

export class IdentityInvitationCodeStatus {

    public static Claimed = new IdentityInvitationCodeStatus('CLAIMED');
    public static Pending = new IdentityInvitationCodeStatus('PENDING');

    public static AllValues = [
        IdentityInvitationCodeStatus.Claimed,
        IdentityInvitationCodeStatus.Pending
    ];

    public static values():IdentityInvitationCodeStatus[] {
        return IdentityInvitationCodeStatus.AllValues;
    }

    public static valueStrings():String[] {
        return IdentityInvitationCodeStatus.AllValues.map((value) => value.name);
    }

    public static valueOf(name:String):IdentityInvitationCodeStatus {
        for (let type of IdentityInvitationCodeStatus.AllValues) {
            if (type.name === name) {
                return type;
            }
        }
        return null;
    }

    constructor(public name:String) {
    }
}

export class IdentityPublicIdentifierScheme {

    public static ABN = new IdentityPublicIdentifierScheme('ABN');

    public static AllValues = [
        IdentityPublicIdentifierScheme.ABN
    ];

    public static values():IdentityPublicIdentifierScheme[] {
        return IdentityPublicIdentifierScheme.AllValues;
    }

    public static valueStrings():String[] {
        return IdentityPublicIdentifierScheme.AllValues.map((value) => value.name);
    }

    public static valueOf(name:String):IdentityPublicIdentifierScheme {
        for (let type of IdentityPublicIdentifierScheme.AllValues) {
            if (type.name === name) {
                return type;
            }
        }
        return null;
    }

    constructor(public name:String) {
    }
}

export class IdentityLinkIdScheme {

    public static AuthenticatorApp = new IdentityPublicIdentifierScheme('AUTHENTICATOR_APP');
    public static MyGov = new IdentityPublicIdentifierScheme('MY_GOV');
    public static Vanguard = new IdentityPublicIdentifierScheme('VANGUARD');

    public static AllValues = [
        IdentityLinkIdScheme.AuthenticatorApp,
        IdentityLinkIdScheme.MyGov,
        IdentityLinkIdScheme.Vanguard
    ];

    public static values():IdentityLinkIdScheme[] {
        return IdentityLinkIdScheme.AllValues;
    }

    public static valueStrings():String[] {
        return IdentityLinkIdScheme.AllValues.map((value) => value.name);
    }

    public static valueOf(name:String):IdentityLinkIdScheme {
        for (let type of IdentityLinkIdScheme.AllValues) {
            if (type.name === name) {
                return type;
            }
        }
        return null;
    }

    constructor(public name:String) {
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
        trim: true
    },
    invitationCodeStatus: {
        type: String,
        trim: true,
        enum: IdentityInvitationCodeStatus.valueStrings()
    },
    invitationCodeExpiryTimestamp: {
        type: Date
    },
    invitationCodeClaimedTimestamp: {
        type: Date
    },
    invitationCodeTemporaryEmailAddress: {
        type: String,
        trim: true
    },
    publicIdentifierScheme: {
        type: String,
        trim: true,
        enum: IdentityPublicIdentifierScheme.valueStrings()
    },
    linkIdScheme: {
        type: String,
        trim: true,
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
    invitationCodeExpiryTimestamp: date;
    invitationCodeClaimedTimestamp: date;
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
