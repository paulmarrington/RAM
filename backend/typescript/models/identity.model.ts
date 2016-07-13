import * as mongoose from 'mongoose';
import * as mongooseAutoIncrement from 'mongoose-auto-increment';
import {conf} from '../bootstrap';
import * as Hashids from 'hashids';
import {RAMEnum, IRAMObject, RAMSchema} from './base';
import {
    HrefValue,
    Identity as DTO,
    CreateIdentityDTO,
    SearchResult
} from '../../../commons/RamAPI';
import {NameModel} from './name.model';
import {SharedSecretModel} from './sharedSecret.model';
import {IProfile, ProfileModel, ProfileProvider} from './profile.model';
import {IParty, PartyModel} from './party.model';
import {SharedSecretTypeModel} from './sharedSecretType.model';

// force schema to load first (see https://github.com/atogov/RAM/pull/220#discussion_r65115456)

/* tslint:disable:no-unused-variable */
const _ProfileModel = ProfileModel;

/* tslint:disable:no-unused-variable */
const _PartyModel = PartyModel;

const MAX_PAGE_SIZE = 100;
const NEW_INVITATION_CODE_EXPIRY_DAYS = 7;

// enums, utilities, helpers ..........................................................................................

const saltedHashids = new Hashids(conf.hashIdsSalt, 6, 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ123456789');

const getNewInvitationCodeExpiry = ():Date => {
    let date = new Date();
    date.setDate(date.getDate() + NEW_INVITATION_CODE_EXPIRY_DAYS);
    return date;
};

export class IdentityType extends RAMEnum {

    public static AgencyProvidedToken = new IdentityType('AGENCY_PROVIDED_TOKEN', 'Agency Provided Token')
        .withIdValueBuilder((identity:IIdentity):String => {
            return identity.identityType + ':' + identity.agencyScheme + ':' + identity.rawIdValue;
        });

    public static InvitationCode = new IdentityType('INVITATION_CODE', 'Invitation Code')
        .withIdValueBuilder((identity:IIdentity):String => {
            return identity.identityType + ':' + identity.rawIdValue;
        });

    public static LinkId = new IdentityType('LINK_ID', 'Link ID')
        .withIdValueBuilder((identity:IIdentity):String => {
            return identity.identityType + ':' + identity.linkIdScheme + ':' + identity.rawIdValue;
        });

    public static PublicIdentifier = new IdentityType('PUBLIC_IDENTIFIER', 'Public Identifier')
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

    constructor(name:string, decodeText:string) {
        super(name, decodeText);
    }

    public withIdValueBuilder(builder:(identity:IIdentity) => String):IdentityType {
        this.buildIdValue = builder;
        return this;
    }
}

export class IdentityInvitationCodeStatus extends RAMEnum {

    public static Claimed = new IdentityInvitationCodeStatus('CLAIMED', 'Claimed');
    public static Pending = new IdentityInvitationCodeStatus('PENDING', 'Pending');
    public static Rejected = new IdentityInvitationCodeStatus('REJECTED', 'Rejected');//TODO this state is not possible?

    protected static AllValues = [
        IdentityInvitationCodeStatus.Claimed,
        IdentityInvitationCodeStatus.Pending,
        IdentityInvitationCodeStatus.Rejected
    ];

    constructor(name:string, decodeText:string) {
        super(name, decodeText);
    }
}

export class IdentityAgencyScheme extends RAMEnum {

    public static Medicare = new IdentityAgencyScheme('MEDICARE', 'Medicare');

    protected static AllValues = [
        IdentityAgencyScheme.Medicare
    ];

    constructor(name:string, decodeText:string) {
        super(name, decodeText);
    }
}

export class IdentityPublicIdentifierScheme extends RAMEnum {

    public static ABN = new IdentityPublicIdentifierScheme('ABN', 'ABN');

    protected static AllValues = [
        IdentityPublicIdentifierScheme.ABN
    ];

    constructor(name:string, decodeText:string) {
        super(name, decodeText);
    }
}

export class IdentityLinkIdScheme extends RAMEnum {

    public static AUSkey = new IdentityPublicIdentifierScheme('AUSKEY', 'AUSkey');
    public static AuthenticatorApp = new IdentityPublicIdentifierScheme('AUTHENTICATOR_APP', 'Authenticator App');
    public static MyGov = new IdentityPublicIdentifierScheme('MY_GOV', 'myGov');

    protected static AllValues = [
        IdentityLinkIdScheme.AUSkey,
        IdentityLinkIdScheme.AuthenticatorApp,
        IdentityLinkIdScheme.MyGov
    ];

    constructor(name:string, decodeText:string) {
        super(name, decodeText);
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
        required: [true, 'Identity Type is required'],
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
    publicIdentifierScheme: {
        type: String,
        trim: true,
        required: [function () {
            return this.identityType === IdentityType.PublicIdentifier.name;
        }, 'Public Identifier Scheme is required'],
        enum: IdentityPublicIdentifierScheme.valueStrings()
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

mongooseAutoIncrement.initialize(mongoose.connection);
IdentitySchema.plugin(mongooseAutoIncrement.plugin, {model: 'Identity', field: 'seq'});

IdentitySchema.pre('validate', function (next:() => void) {
    const identityType = IdentityType.valueOf(this.identityType) as IdentityType;
    if (identityType === IdentityType.InvitationCode && !this.rawIdValue) {
        this.nextCount((err:Error, count:number) => {
            this.rawIdValue = saltedHashids.encode(count);
            this.idValue = identityType ? identityType.buildIdValue(this) : null;
            next();
        });
    } else {
        this.idValue = identityType ? identityType.buildIdValue(this) : null;
        next();
    }
});

// interfaces .........................................................................................................

export interface IIdentity extends IRAMObject {
    idValue:string;
    rawIdValue:string;
    identityType:string;
    defaultInd:boolean;
    agencyScheme:string;
    agencyToken:string;
    invitationCodeStatus:string;
    invitationCodeExpiryTimestamp:Date;
    invitationCodeClaimedTimestamp:Date;
    invitationCodeTemporaryEmailAddress:string;
    linkIdScheme:string;
    linkIdConsumer:string;
    publicIdentifierScheme:string;
    profile:IProfile;
    party:IParty;
    identityTypeEnum():IdentityType;
    agencySchemeEnum():IdentityAgencyScheme;
    invitationCodeStatusEnum():IdentityInvitationCodeStatus;
    publicIdentifierSchemeEnum():IdentityPublicIdentifierScheme;
    linkIdSchemeEnum():IdentityLinkIdScheme;
    toHrefValue(includeValue:boolean):Promise<HrefValue<DTO>>;
    toDTO():Promise<DTO>;
}

export interface IIdentityModel extends mongoose.Model<IIdentity> {
    createFromDTO:(dto:CreateIdentityDTO) => Promise<IIdentity>;
    createInvitationCodeIdentity:(givenName:string, familyName:string, dateOfBirth:string) => Promise<IIdentity>;
    findByIdValue:(idValue:string) => Promise<IIdentity>;
    findByInvitationCode:(invitationCode:string) => Promise<IIdentity>;
    findPendingByInvitationCodeInDateRange:(invitationCode:string, date:Date) => Promise<IIdentity>;
    findDefaultByPartyId:(partyId:string) => Promise<IIdentity>;
    listByPartyId:(partyId:string) => Promise<IIdentity[]>;
    search:(page:number, pageSize:number) => Promise<SearchResult<IIdentity>>;
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
        '/api/v1/identity/' + encodeURIComponent(this.idValue),
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
        await this.profile.toDTO(),
        await this.party.toHrefValue()
    );
});

// static methods .....................................................................................................

IdentitySchema.static('findByIdValue', (idValue:string) => {
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

IdentitySchema.static('findByInvitationCode', (invitationCode:string) => {
    return this.IdentityModel
        .findOne({
            rawIdValue: invitationCode,
            identityType: IdentityType.InvitationCode.name
        })
        .deepPopulate([
            'profile.name',
            'profile.sharedSecrets.sharedSecretType',
            'party'
        ])
        .exec();
});

IdentitySchema.static('findPendingByInvitationCodeInDateRange', (invitationCode:string, date:Date) => {
    return this.IdentityModel
        .findOne({
            rawIdValue: invitationCode,
            identityType: IdentityType.InvitationCode.name,
            invitationCodeStatus: IdentityInvitationCodeStatus.Pending.name,
            invitationCodeExpiryTimestamp: {$gte: date}
        })
        .deepPopulate([
            'profile.name',
            'profile.sharedSecrets.sharedSecretType',
            'party'
        ])
        .exec();
});

IdentitySchema.static('findDefaultByPartyId', (partyId:string) => {
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

IdentitySchema.static('listByPartyId', (partyId:string) => {
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

IdentitySchema.static('search', (page:number, reqPageSize:number) => {
    return new Promise<SearchResult<IIdentity>>(async (resolve, reject) => {
        const pageSize:number = reqPageSize ? Math.min(reqPageSize, MAX_PAGE_SIZE) : MAX_PAGE_SIZE;
        try {
            const query = {
                identityType: IdentityType.LinkId.name
            };
            const count = await this.IdentityModel
                .count(query)
                .exec();
            const list = await this.IdentityModel
                .find(query)
                .deepPopulate([
                    'profile.name',
                    'party'
                ])
                .sort({'profile.name._displayName': -1})
                .skip((page - 1) * pageSize)
                .limit(pageSize)
                .exec();
            resolve(new SearchResult<IIdentity>(page, count, pageSize, list));
        } catch (e) {
            reject(e);
        }
    });
});

IdentitySchema.static('createInvitationCodeIdentity',
    async (givenName:string, familyName:string, dateOfBirth:string):Promise<IIdentity> => {

        return await this.IdentityModel.createFromDTO(
        new CreateIdentityDTO(
            undefined, // TODO should this be a UUID?
            'INDIVIDUAL',
            givenName,
            familyName,
            undefined,
            'DATE_OF_BIRTH',
            dateOfBirth,
            IdentityType.InvitationCode.name,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            ProfileProvider.Temp.name
        ));
});

/**
 * Creates an InvitationCode identity required when creating a new relationship. This identity is temporary and will
 * only be associated with the relationship until the relationship is accepted, whereby the relationship will be
 * transferred to the authorised identity.
 */
/* tslint:disable:max-func-body-length */
IdentitySchema.static('createFromDTO', async(dto:CreateIdentityDTO):Promise<IIdentity> => {

    const name = await NameModel.create({
        givenName: dto.givenName,
        familyName: dto.familyName,
        unstructuredName: dto.unstructuredName
    });

    const sharedSecret = await SharedSecretModel.create({
        value: dto.sharedSecretValue,
        sharedSecretType: await SharedSecretTypeModel.findByCodeInDateRange(dto.sharedSecretTypeCode, new Date())
    });

    const profile = await ProfileModel.create({
        provider: dto.profileProvider,
        name: name,
        sharedSecrets: [sharedSecret]
    });

    const party = await PartyModel.create({
        partyType: dto.partyType,
        name: name
    });

    const identity = await this.IdentityModel.create({
        rawIdValue: dto.rawIdValue,
        identityType: dto.identityType,
        defaultInd: true,
        agencyScheme: dto.agencyScheme,
        agencyToken: dto.agencyToken,
        invitationCodeStatus: dto.identityType === IdentityType.InvitationCode.name ?
            IdentityInvitationCodeStatus.Pending.name : undefined,
        invitationCodeExpiryTimestamp: dto.identityType === IdentityType.InvitationCode.name ?
            getNewInvitationCodeExpiry() : undefined,
        invitationCodeClaimedTimestamp: undefined,
        publicIdentifierScheme: dto.publicIdentifierScheme,
        linkIdScheme: dto.linkIdScheme,
        linkIdConsumer: dto.linkIdConsumer,
        profile: profile,
        party: party
    });

    return identity;

});

// concrete model .....................................................................................................

export const IdentityModel = mongoose.model(
    'Identity',
    IdentitySchema) as IIdentityModel;
