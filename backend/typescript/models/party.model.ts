import * as mongoose from 'mongoose';
import {RAMEnum, IRAMObject, RAMSchema} from './base';

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
}

/* tslint:disable:no-empty-interfaces */
export interface IPartyModel extends mongoose.Model<IParty> {
}

// instance methods ...................................................................................................

PartySchema.method('partyTypeEnum', function () {
    return PartyType.valueOf(this.partyType);
});

// static methods .....................................................................................................

// concrete model .....................................................................................................

export const PartyModel = mongoose.model(
    'Party',
    PartySchema) as IPartyModel;