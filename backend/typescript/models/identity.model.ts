import * as mongoose from 'mongoose';
import {RAMEnum, IRAMObject, RAMSchema} from './base';
import {IProfile, ProfileModel} from './profile.model';
import {IParty, PartyModel} from './party.model';
import {
    HrefValue,
    Identity as DTO
} from '../../../commons/RamAPI';

// force schema to load first (see https://github.com/atogov/RAM/pull/220#discussion_r65115456)

/* tslint:disable:no-unused-variable */
const _ProfileModel = ProfileModel;

/* tslint:disable:no-unused-variable */
const _PartyModel = PartyModel;

// enums, utilities, helpers ..........................................................................................

export class IdentityType extends RAMEnum {

    public static AgencyProvidedToken = new IdentityType('AGENCY_PROVIDED_TOKEN')
        .withIdValueBuilder((identity:IIdentity):String => {
            return identity.identityType + ':' + identity.agencyScheme + ':' + identity.rawIdValue;
        });

    public static InvitationCode = new IdentityType('INVITATION_CODE')
        .withIdValueBuilder((identity:IIdentity):String => {
            return identity.identityType + ':' + identity.rawIdValue;
        });

    public static LinkId = new IdentityType('LINK_ID')
        .withIdValueBuilder((identity:IIdentity):String => {
            return identity.identityType + ':' + identity.linkIdScheme + ':' + identity.rawIdValue;
        });

    public static PublicIdentifier = new IdentityType('PUBLIC_IDENTIFIER')
        .withIdValueBuilder((identity:IIdentity):String => {
            return identity.identityType + ':' + identity.publicIdentifierScheme + ':' + identity.rawIdValue;
        });

    protected static AllValues = [
        IdentityType.AgencyProvidedToken,
        IdentityType.InvitationCode,
        IdentityType.LinkId,
        IdentityType.PublicIdentifier
    ];

    public buildIdValue:(identity:IIdentity) => String;

    constructor(name:String) {
        super(name);
    }

    public withIdValueBuilder(builder:(identity:IIdentity) => String):IdentityType {
        this.buildIdValue = builder;
        return this;
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
    rawIdValue: {
        type: String,
        required: [true, 'Raw Id Value is required'],
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
    agencyScheme: {
        type: String,
        trim: true,
        required: [function () {
            return this.identityType === IdentityType.AgencyProvidedToken.name;
        }, 'Agency Scheme is required'],
        enum: IdentityAgencyScheme.valueStrings()
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
    },
    party: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Party',
        required: [true, 'Party is required']
    }
});

IdentitySchema.pre('validate', function (next:() => void) {
    const identityType = IdentityType.valueOf(this.identityType) as IdentityType;
    this.idValue = identityType ? identityType.buildIdValue(this) : null;
    next();
});

// interfaces .........................................................................................................

export interface IIdentity extends IRAMObject {
    idValue: string;
    rawIdValue: string;
    identityType: string;
    defaultInd: boolean;
    agencyScheme: string;
    agencyToken: string;
    invitationCodeStatus: string;
    invitationCodeExpiryTimestamp: Date;
    invitationCodeClaimedTimestamp: Date;
    invitationCodeTemporaryEmailAddress: string;
    publicIdentifierScheme: string;
    linkIdScheme: string;
    linkIdConsumer: string;
    profile: IProfile;
    party: IParty;
    identityTypeEnum(): IdentityType;
    agencySchemeEnum(): IdentityAgencyScheme;
    invitationCodeStatusEnum(): IdentityInvitationCodeStatus;
    publicIdentifierSchemeEnum(): IdentityPublicIdentifierScheme;
    linkIdSchemeEnum(): IdentityLinkIdScheme;
    toHrefValue(includeValue:boolean):HrefValue<DTO>;
    toDTO():DTO;
}

export interface IIdentityModel extends mongoose.Model<IIdentity> {
    findByIdValue: (idValue:String) => mongoose.Promise<IIdentity>;
    findDefaultByPartyId: (partyId:String) => mongoose.Promise<IIdentity>;
    listByPartyId: (partyId:String) => mongoose.Promise<IIdentity[]>;
    search: (page:number, pageSize:number) => mongoose.Promise<IIdentity[]>;
}

// instance methods ...................................................................................................

IdentitySchema.method('identityTypeEnum', function () {
    return IdentityType.valueOf(this.identityType);
});

IdentitySchema.method('agencySchemeEnum', function () {
    return IdentityAgencyScheme.valueOf(this.agencyScheme);
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

IdentitySchema.method('toHrefValue', async function (includeValue:boolean) {
    return new HrefValue(
        '/api/v1/identity/' + this.idValue,
        includeValue ? await this.toDTO() : undefined
    );
});

IdentitySchema.method('toDTO', async function () {
    return new DTO(
        this.idValue,
        this.rawIdValue,
        this.identityType,
        this.defaultInd,
        this.agencyScheme,
        this.agencyToken,
        this.invitationCodeStatus,
        this.invitationCodeExpiryTimestamp,
        this.invitationCodeClaimedTimestamp,
        this.invitationCodeTemporaryEmailAddress,
        this.publicIdentifierScheme,
        this.linkIdScheme,
        this.linkIdConsumer,
        this.profile.toDTO(),
        await this.party.toHrefValue()
    );
});
// static methods .....................................................................................................

IdentitySchema.static('findByIdValue', (idValue:String) => {
    return this.IdentityModel
        .findOne({
            idValue: idValue
        })
        .deepPopulate([
            'profile.name',
            'profile.sharedSecrets.sharedSecretType',
            'party'
        ])
        .exec();
});

IdentitySchema.static('findDefaultByPartyId', (partyId:String) => {
    return this.IdentityModel
        .findOne({
            'party': partyId,
            defaultInd: true
        })
        .deepPopulate([
            'profile.name',
            'profile.sharedSecrets.sharedSecretType',
            'party'
        ])
        .sort({createdAt: 1})
        .exec();
});

IdentitySchema.static('listByPartyId', (partyId:String) => {
    return this.IdentityModel
        .find({
            'party': partyId
        })
        .deepPopulate([
            'profile.name',
            'profile.sharedSecrets.sharedSecretType',
            'party'
        ])
        .sort({idValue: 1})
        .exec();
});

IdentitySchema.static('search', (page:number, pageSize:number) => {
    return this.IdentityModel
        .find({})
        .deepPopulate([
            'profile.name',
            'profile.sharedSecrets.sharedSecretType',
            'party'
        ])
        .limit(pageSize)
        .skip((page - 1) * pageSize)
        .sort({name: 1})
        .exec();
});

// concrete model .....................................................................................................

export const IdentityModel = mongoose.model(
    'Identity',
    IdentitySchema) as IIdentityModel;
