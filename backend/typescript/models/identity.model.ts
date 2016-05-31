import * as mongoose from 'mongoose';
import {IRAMObject, RAMSchema} from './base';

export class IdentityType {

    public static ProvidedToken = new IdentityType('agency_provided_token');
    public static PublicIdentifier = new IdentityType('public_identifier');
    public static LinkId = new IdentityType('link_id');

    public static AllValues = [
        IdentityType.ProvidedToken,
        IdentityType.PublicIdentifier,
        IdentityType.LinkId
    ];

    public static values():String[] {
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

export interface IIdentity extends IRAMObject {
    idValue: string;
    typeName: string;
    defaultValues: string;
    type(): IdentityType;
}

const IdentitySchema = RAMSchema({
    idValue: {
        type: String,
        required: [true, 'Id Value is required'],
        trim: true
    },
    typeName: {
        type: String,
        required: [true, 'Type is required'],
        trim: true,
        enum: IdentityType.values()
    },
    defaultValue: {
        type: String
    }
});

IdentitySchema.method('type', function () {
    return IdentityType.valueOf(this.typeName);
});

export interface IIdentityModel extends mongoose.Model<IIdentity> {
    findByIdValueAndType: (idValue:String, type:IdentityType) => mongoose.Promise<IIdentity>;
}

IdentitySchema.static('findByIdValueAndType', (idValue:String, type:IdentityType) => {
    return this.IdentityModel
        .findOne({
            idValue: idValue,
            typeName: type.name
        })
        .exec();
});

export const IdentityModel = mongoose.model(
    'Identity',
    IdentitySchema) as IIdentityModel;
