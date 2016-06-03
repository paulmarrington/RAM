import * as mongoose from 'mongoose';
import {IRAMObject, RAMSchema} from './base';
import {IProfile, ProfileModel} from './profile.model';

// force schema to load first (see https://github.com/atogov/RAM/pull/220#discussion_r65115456)

/* tslint:disable:no-unused-variable */
const _ProfileModel = ProfileModel;

// enums, utilities, helpers ..........................................................................................

export class IdentityType {

    public static ProvidedToken = new IdentityType('AGENCY_PROVIDED_TOKEN');
    public static PublicIdentifier = new IdentityType('PUBLIC_IDENTIFIER');
    public static LinkId = new IdentityType('LINK_ID');

    public static AllValues = [
        IdentityType.ProvidedToken,
        IdentityType.PublicIdentifier,
        IdentityType.LinkId
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
    token: {
        type: String,
        trim: true
    },
    scheme: {
        type: String,
        trim: true
    },
    consumer: {
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
    token: string;
    scheme: string;
    consumer: string;
    profile: IProfile;
    identityTypeEnum(): IdentityType;
}

export interface IIdentityModel extends mongoose.Model<IIdentity> {
    findByIdValueAndType: (idValue:String, type:IdentityType) => mongoose.Promise<IIdentity>;
}

// instance methods ...................................................................................................

IdentitySchema.method('identityTypeEnum', function () {
    return IdentityType.valueOf(this.identityType);
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
