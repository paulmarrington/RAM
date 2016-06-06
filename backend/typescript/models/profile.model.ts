import * as mongoose from 'mongoose';
import {RAMEnum, IRAMObject, RAMSchema} from './base';
import {IName, NameModel} from './name.model';
import {ISharedSecret, SharedSecretModel} from './sharedSecret.model';

// force schema to load first (see https://github.com/atogov/RAM/pull/220#discussion_r65115456)

/* tslint:disable:no-unused-variable */
const _NameModel = NameModel;

/* tslint:disable:no-unused-variable */
const _SharedSecretModel = SharedSecretModel;

// enums, utilities, helpers ..........................................................................................

export class ProfileProvider extends RAMEnum {

    public static AuthenticatorApp = new ProfileProvider('AUTHENTICATOR_APP');
    public static MyGov = new ProfileProvider('MY_GOV');
    public static SelfAsserted = new ProfileProvider('SELF_ASSERTED');
    public static Vanguard = new ProfileProvider('VANGUARD');

    protected static AllValues = [
        ProfileProvider.AuthenticatorApp,
        ProfileProvider.MyGov,
        ProfileProvider.SelfAsserted,
        ProfileProvider.Vanguard
    ];

    constructor(public name:String) {
        super(name);
    }
}

// schema .............................................................................................................

const ProfileSchema = RAMSchema({
    provider: {
        type: String,
        required: [true, 'Provider is required'],
        trim: true,
        enum: ProfileProvider.valueStrings()
    },
    name: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Name',
        required: [true, 'Name is required']
    },
    sharedSecrets: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SharedSecret'
    }]
});

// interfaces .........................................................................................................

export interface IProfile extends IRAMObject {
    provider: string;
    name: IName;
    sharedSecrets: [ISharedSecret];
    providerEnum(): ProfileProvider;
    getSharedSecret(code:String): ISharedSecret;
}

/* tslint:disable:no-empty-interfaces */
export interface IProfileModel extends mongoose.Model<IProfile> {
}

// instance methods ...................................................................................................

ProfileSchema.method('providerEnum', function () {
    return ProfileProvider.valueOf(this.provider);
});

ProfileSchema.method('getSharedSecret', function (code:String) {
    if (code && this.sharedSecrets) {
        for (let sharedSecret of this.sharedSecrets) {
            if (sharedSecret.sharedSecretType.code === code) {
                return sharedSecret;
            }
        }
    }
    return null;
});

// static methods .....................................................................................................

// concrete model .....................................................................................................

export const ProfileModel = mongoose.model(
    'Profile',
    ProfileSchema) as IProfileModel;
