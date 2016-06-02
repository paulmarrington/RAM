import * as mongoose from 'mongoose';
import {IRAMObject, RAMSchema} from './base';

// enums, utilities, helpers ..........................................................................................

export class ProfileProvider {

    public static MyGov = new ProfileProvider('MY_GOV');

    public static AllValues = [
        ProfileProvider.MyGov
    ];

    public static values():ProfileProvider[] {
        return ProfileProvider.AllValues;
    }

    public static valueStrings():String[] {
        return ProfileProvider.AllValues.map((value) => value.name);
    }

    public static valueOf(name:String):ProfileProvider {
        for (let type of ProfileProvider.AllValues) {
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

const ProfileSchema = RAMSchema({
    provider: {
        type: String,
        required: [true, 'Provider is required'],
        trim: true,
        enum: ProfileProvider.valueStrings()
    }
});

// interfaces .........................................................................................................

export interface IProfile extends IRAMObject {
    provider: string;
    providerEnum(): ProfileProvider;
}

/* tslint:disable:no-empty-interfaces */
export interface IProfileModel extends mongoose.Model<IProfile> {
}

// instance methods ...................................................................................................

ProfileSchema.method('providerEnum', function () {
    return ProfileProvider.valueOf(this.profileProvider);
});

// static methods .....................................................................................................

// concrete model .....................................................................................................

export const ProfileModel = mongoose.model(
    'Profile',
    ProfileSchema) as IProfileModel;
