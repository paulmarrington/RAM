import * as mongoose from 'mongoose';
import {RAMEnum, IRAMObject, RAMSchema} from './base';
import {IIdentity, IdentityModel} from './identity.model';
import {
    HrefValue,
    Party as DTO,
    Identity as IdentityDTO
} from '../../../commons/RamAPI';

// enums, utilities, helpers ..........................................................................................

export class PartyType extends RAMEnum {

    public static ABN = new PartyType('ABN');
    public static Individual = new PartyType('INDIVIDUAL');

    protected static AllValues = [
        PartyType.ABN,
        PartyType.Individual,
    ];

    constructor(name:String) {
        super(name);
    }
}

// schema .............................................................................................................

const PartySchema = RAMSchema({
    partyType: {
        type: String,
        required: [true, 'Type is required'],
        trim: true,
        enum: PartyType.valueStrings()
    }
});

// interfaces .........................................................................................................

export interface IParty extends IRAMObject {
    partyType: string;
    partyTypeEnum(): PartyType;
    toHrefValue(includeValue:boolean): Promise<HrefValue<DTO>>;
    toDTO(): Promise<DTO>;
}

/* tslint:disable:no-empty-interfaces */
export interface IPartyModel extends mongoose.Model<IParty> {
    findByIdentityIdValue: (idValue:String) => mongoose.Promise<IParty>;
}

// instance methods ...................................................................................................

PartySchema.method('partyTypeEnum', function () {
    return PartyType.valueOf(this.partyType);
});

PartySchema.method('toHrefValue', async function (includeValue:boolean) {
    const defaultIdentity = await IdentityModel.findDefaultByPartyId(this.id);
    if (defaultIdentity) {
        return new HrefValue(
            '/api/v1/party/identity/' + defaultIdentity.idValue,
            includeValue ? await this.toDTO() : undefined
        );
    } else {
        throw new Error('Default Identity not found');
    }
});

PartySchema.method('toDTO', async function () {
    const identities = await IdentityModel.listByPartyId(this.id);
    return new DTO(
        this.partyType,
        await Promise.all<HrefValue<IdentityDTO>>(identities.map(
            async (identity:IIdentity) => {
                return await identity.toHrefValue(false);
            }))
    );
});

// static methods .....................................................................................................

PartySchema.static('findByIdentityIdValue', async (idValue:String) => {
    const identity = await IdentityModel.findByIdValue(idValue);
    return identity.party;
});

// concrete model .....................................................................................................

export const PartyModel = mongoose.model(
    'Party',
    PartySchema) as IPartyModel;