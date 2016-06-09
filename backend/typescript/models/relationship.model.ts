import * as mongoose from 'mongoose';
import {RAMEnum, IRAMObject, RAMSchema} from './base';
import {IParty, PartyModel} from './party.model';
import {IName, NameModel} from './name.model';

// force schema to load first (see https://github.com/atogov/RAM/pull/220#discussion_r65115456)

/* tslint:disable:no-unused-variable */
const _PartyModel = PartyModel;

/* tslint:disable:no-unused-variable */
const _NameModel = NameModel;

// enums, utilities, helpers ..........................................................................................

export class RelationshipStatus extends RAMEnum {

    public static Invalid = new RelationshipStatus('INVALID');
    public static Pending = new RelationshipStatus('PENDING');
    public static Active = new RelationshipStatus('ACTIVE');
    public static Deleted = new RelationshipStatus('DELETED');
    public static Cancelled = new RelationshipStatus('CANCELLED');

    protected static AllValues = [
        RelationshipStatus.Active,
        RelationshipStatus.Cancelled,
        RelationshipStatus.Deleted,
        RelationshipStatus.Invalid,
        RelationshipStatus.Pending
    ];

    constructor(name:String) {
        super(name);
    }
}

// schema .............................................................................................................

const RelationshipSchema = RAMSchema({
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Party',
        required: [true, 'Subject is required']
    },
    subjectNickName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Name',
        required: [true, 'Subject Nick Name is required']
    },
    delegate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Party',
        required: [true, 'Subject is required']
    },
    delegateNickName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Name',
        required: [true, 'Delegate Nick Name is required']
    },
    startTimestamp: {
        type: Date,
        required: [true, 'Start Timestamp is required']
    },
    endTimestamp: {
        type: Date
    },
    endEventTimestamp: {
        type: Date,
        required: [function () {
            return this.status === RelationshipStatus.Invalid ||
                this.status === RelationshipStatus.Deleted ||
                this.status === RelationshipStatus.Cancelled;
        }, 'End Event Timestamp is required']
    },
    status: {
        type: String,
        required: [true, 'Status is required'],
        trim: true,
        enum: RelationshipStatus.valueStrings()
    }
});

// interfaces .........................................................................................................

export interface IRelationship extends IRAMObject {
    subject: IParty;
    subjectNickName: IName;
    delegate: IParty;
    delegateNickName: IName;
    startTimestamp: Date;
    endTimestamp?: Date;
    endEventTimestamp?: Date;
    status: string;
    statusEnum(): RelationshipStatus;
}

/* tslint:disable:no-empty-interfaces */
export interface IRelationshipModel extends mongoose.Model<IRelationship> {
}

// instance methods ...................................................................................................

RelationshipSchema.method('statusEnum', function () {
    return RelationshipStatus.valueOf(this.status);
});

// static methods .....................................................................................................

// concrete model .....................................................................................................

export const RelationshipModel = mongoose.model(
    'Relationship',
    RelationshipSchema) as IRelationshipModel;