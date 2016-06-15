import * as mongoose from 'mongoose';
import {RAMEnum, IRAMObject, RAMSchema, Query} from './base';
import {IParty, PartyModel} from './party.model';
import {IName, NameModel} from './name.model';
import {IRelationshipType} from './relationshipType.model';
import {IdentityModel} from './identity.model';
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

const MAX_PAGE_SIZE = 10;

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
    relationshipType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RelationshipType',
        required: [true, 'Relationship Type is required']
    },
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
    relationshipType:IRelationshipType;
    subject: IParty;
    subjectNickName: IName;
    delegate: IParty;
    delegateNickName: IName;
    startTimestamp: Date;
    endTimestamp?: Date;
    endEventTimestamp?: Date;
    status: string;
    statusEnum(): RelationshipStatus;
    toHrefValue(includeValue:boolean):Promise<HrefValue<DTO>>;
    toDTO():Promise<DTO>;
}

export interface IRelationshipModel extends mongoose.Model<IRelationship> {
    findByIdentifier:(id:String) => mongoose.Promise<IRelationship>;
    findPendingByInvitationCodeInDateRange:(invitationCode:String, date:Date) => mongoose.Promise<IRelationship>;
    search:(subjectIdentityIdValue:string, delegateIdentityIdValue:string, page:number, pageSize:number) => Promise<SearchResult<IRelationship>>;
}

// instance methods ...................................................................................................

RelationshipSchema.method('statusEnum', function () {
    return RelationshipStatus.valueOf(this.status);
});

RelationshipSchema.method('toHrefValue', async function (includeValue:boolean) {
    const relationshipId:string = this._id.toString();
    return new HrefValue(
        `/api/v1/relationship/${relationshipId}`,
        includeValue ? await this.toDTO() : undefined
    );
});

RelationshipSchema.method('toDTO', async function () {
    return new DTO(
        await this.relationshipType.toHrefValue(false),
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

RelationshipSchema.static('findByIdentifier', (id:String) => {
    // TODO migrate from _id to another id
    return this.RelationshipModel
        .findOne({
            _id: id
        })
        .deepPopulate([
            'relationshipType',
            'subject',
            'subjectNickName',
            'delegate',
            'delegateNickName'
        ])
        .exec();
});

RelationshipSchema.static('findPendingByInvitationCodeInDateRange', async (invitationCode:String, date:Date) => {
    const identity = await IdentityModel.findPendingByInvitationCodeInDateRange(invitationCode, date);
    if (identity) {
        const delegate = identity.party;
        return this.RelationshipModel
            .findOne({
                delegate: delegate
            })
            .deepPopulate([
                'relationshipType',
                'subject',
                'subjectNickName',
                'delegate',
                'delegateNickName'
            ])
            .exec();
    }
    return null;
});

RelationshipSchema.static('search', (subjectIdentityIdValue:string, delegateIdentityIdValue:string, page:number, reqPageSize:number) => {
    return new Promise<SearchResult<IRelationship>>(async (resolve, reject) => {
        const pageSize:number = reqPageSize ? Math.min(reqPageSize, MAX_PAGE_SIZE) : MAX_PAGE_SIZE;
        try {
            const query = await (new Query()
                .when(subjectIdentityIdValue, 'subject', () => PartyModel.findByIdentityIdValue(subjectIdentityIdValue))
                .when(delegateIdentityIdValue, 'delegate', () => PartyModel.findByIdentityIdValue(delegateIdentityIdValue))
                .build());
            const count = await this.RelationshipModel.count(query).exec();
            const list = await this.RelationshipModel
                .find(query)
                .deepPopulate([
                    'relationshipType',
                    'subject',
                    'subjectNickName',
                    'delegate',
                    'delegateNickName'
                ])
                .skip((page - 1) * pageSize)
                .limit(pageSize)
                .sort({name: 1})
                .exec();
            resolve(new SearchResult<IRelationship>(count, pageSize, list));
        } catch (e) {
            reject(e);
        }
    });
});
// concrete model .....................................................................................................

export const RelationshipModel = mongoose.model(
    'Relationship',
    RelationshipSchema) as IRelationshipModel;