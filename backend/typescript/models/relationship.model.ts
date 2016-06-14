import * as mongoose from 'mongoose';
import {RAMEnum, IRAMObject, RAMSchema} from './base';
import {IParty, PartyModel} from './party.model';
import {IName, NameModel} from './name.model';
import {
    HrefValue,
    Relationship as DTO,
    SearchResult
} from '../../../commons/RamAPI';

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
        type: Date,
        set: function (value:String) {
            if (value) {
                this.endEventTimestamp = new Date();
            }
            return value;
        }
    },
    endEventTimestamp: {
        type: Date,
        required: [function () {
            return this.endTimestamp;
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
    toHrefValue(includeValue:boolean):HrefValue<DTO>;
    toDTO():DTO;
}

/* tslint:disable:no-empty-interfaces */
export interface IRelationshipModel extends mongoose.Model<IRelationship> {
    search:(page:number, pageSize:number) => Promise<SearchResult<IRelationship>>;
}

// instance methods ...................................................................................................

RelationshipSchema.method('statusEnum', function () {
    return RelationshipStatus.valueOf(this.status);
});

RelationshipSchema.method('toHrefValue', async function (includeValue:boolean) {
    return new HrefValue(
        // TODO use correct reference
        '/api/v1/'+'relationship/' + this.idValue,
        includeValue ? await this.toDTO() : undefined
    );
});

RelationshipSchema.method('toDTO', async function () {
    return new DTO(
        await this.subject.toHrefValue(true),
        await this.subjectNickName.toDTO(),
        await this.delegate.toHrefValue(true),
        await this.delegateNickName.toDTO(),
        this.startTimestamp,
        this.endTimestamp,
        this.endEventTimestamp,
        this.status
    );
});

// static methods .....................................................................................................

RelationshipSchema.static('search', (page:number, pageSize:number) => {
    return new Promise<SearchResult<IRelationship>>(async (resolve, reject) => {
        try {
            const query = {};
            const count = await this.RelationshipModel
                .count(query)
                .exec();
            const list = await this.RelationshipModel
                .find(query)
                .deepPopulate([
                    'subject',
                    'subjectNickName',
                    'delegate',
                    'delegateNickName'
                ])
                .skip((page - 1) * pageSize)
                .limit(pageSize)
                .sort({name: 1})
                .exec();
            resolve(new SearchResult<IRelationship>(count, list));
        } catch (e) {
            reject(e);
        }
    });
});
// concrete model .....................................................................................................

export const RelationshipModel = mongoose.model(
    'Relationship',
    RelationshipSchema) as IRelationshipModel;