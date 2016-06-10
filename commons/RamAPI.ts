// system domain ......................................................................................................

export enum RAMMessageType {
    Error = 1,
    Info = 2,
    Success = 3
}

export interface IResponse<T> {
    data?: T;
    token?: string;
    alert?: Alert;
}

export interface Alert {
    messages: string[];
    alertType: RAMMessageType;
}

export class ErrorResponse implements IResponse<void> {
    alert:Alert;

    constructor(messages:string | string[],
                alertType:number = RAMMessageType.Error) {
        if (Array.isArray(messages)) {
            this.alert = {messages: messages, alertType: alertType};
        } else {
            this.alert = {messages: [messages], alertType: alertType};
        }
    }
}

export interface IKeyValue<T> {
    key: string;
    value: T;
}

export class HrefValue<T> {
    constructor(public href:string,
                public value?:T) {
    }
}

// business domain ....................................................................................................

export class ICodeDecode {
    constructor(public code:string,
                public shortDecodeText:string,
                public longDecodeText:string,
                public startTimestamp:Date,
                public endTimestamp:Date) {
    }
}

export class RelationshipType extends ICodeDecode {
    constructor(code:string,
                shortDecodeText:string,
                longDecodeText:string,
                startTimestamp:Date,
                endTimestamp:Date,
                public voluntaryInd:boolean,
                public relationshipAttributeNames:RelationshipAttributeNameUsage[]) {
        super(code, shortDecodeText, longDecodeText, startTimestamp, endTimestamp);
    }
}

export class RelationshipAttributeNameUsage {
    constructor(public mandatory:boolean,
                public defaultValue:string,
                public attributeNameDef:HrefValue<RelationshipAttributeName>) {
    }
}

export class RelationshipAttributeName extends ICodeDecode {
    constructor(code:string,
                shortDecodeText:string,
                longDecodeText:string,
                startTimestamp:Date,
                endTimestamp:Date,
                public name:string,
                public domain:string,
                public classifier:string,
                public category:string,
                public permittedValues:string[]) {
        super(code, shortDecodeText, longDecodeText, startTimestamp, endTimestamp);
    }
}

export class Name {
    constructor(public givenName:string,
                public familyName:string,
                public unstructuredName:string) {
    }
}

export class SharedSecret {
    constructor(public value:string,
                public sharedSecretType:SharedSecretType) {
    }
}

export class SharedSecretType extends ICodeDecode {
    constructor(code:string,
                shortDecodeText:string,
                longDecodeText:string,
                startTimestamp:Date,
                endTimestamp:Date,
                public domain:string) {
        super(code, shortDecodeText, longDecodeText, startTimestamp, endTimestamp);
    }
}

export class Profile {
    constructor(public provider:string,
                public name:Name,
                public sharedSecrets:SharedSecret[]) {
    }
}

export class Identity {
    constructor(public idValue:string,
                public rawIdValue:string,
                public identityType:string,
                public defaultInd:boolean,
                public agencyScheme:string,
                public agencyToken:string,
                public invitationCodeStatus:string,
                public invitationCodeClaimedTimestamp:Date,
                public invitationCodeExpiryTimestamp:Date,
                public invitationCodeTemporaryEmailAddress:string,
                public publicIdentifierScheme:string,
                public linkIdScheme:string,
                public linkIdConsumer:string,
                public profile:Profile,
                public party:HrefValue<Party>) {
    }
}

export class Party {
    constructor(public partyType:string,
                public identities:HrefValue<Identity>[]) {
    }
}

export class Relationship {
    constructor(public subject:Party,
                public subjectNickName:Name,
                public delegate:Party,
                public delegateNickName:Name,
                public startTimestamp:Date,
                public endTimestamp:Date,
                public endEventTimestamp:Date,
                public status:string) {
    }
}

// old deprecated .....................................................................................................

export class RelationshipTableReq {
    constructor(
        public pageSize: number,
        public pageNumber: number,
        public canActFor: boolean,
        public filters: { [index: string]: string },
        public sortByField: string
    ) {
    }
}

export interface IRelationshipTableRes {
    total: number;
    table: IRelationshipTableRow[];
    relationshipOptions: Array<string>;
    accessLevelOptions: Array<string>;
    statusValueOptions: Array<string>;
}

export class EmptyRelationshipTableRes implements IRelationshipTableRes {
    total = 0;
    table = new Array<IRelationshipTableRow>();
    relationshipOptions = new Array<string>();
    accessLevelOptions = new Array<string>();
    statusValueOptions = new Array<string>();
}

export interface IRelationshipTableRow {
    name: string;
    subName?: string;
    relId: string;
    rel: string;
    access: string;
    status: string;
}
