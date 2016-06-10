import * as mongoose from 'mongoose';
import {RAMEnum, IRAMObject, RAMSchema} from './base';
import {IIdentity, IdentityModel} from './identity.model';
import {
    HrefValue,
    Party as DTO
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
    toHrefValue(includeValue:boolean): HrefValue<DTO>;
    toDTO(): DTO;
}

/* tslint:disable:no-empty-interfaces */
export interface IPartyModel extends mongoose.Model<IParty> {
    findByIdentityIdValue: (idValue:String) => mongoose.Promise<IParty>;
}

// instance methods ...................................................................................................

PartySchema.method('partyTypeEnum', function () {
    return PartyType.valueOf(this.partyType);
});

PartySchema.method('toHrefValue', function (includeValue:boolean) {
    return new HrefValue(
        '/api/v1/party/identity/' + 'TODO',
        includeValue ? this.toDTO() : null
    );
});

PartySchema.method('toDTO', async function () {
    const identities = await IdentityModel.listByPartyId(this.id);
    console.log('Identities count = ', identities.length);
    return new DTO(
        this.partyType,
        identities.map((identity:IIdentity) => {
            return new HrefValue(
                '/api/v1/identity/' + identity.idValue
            );
        })
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