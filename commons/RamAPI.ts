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

/***************************************************
 ***************************************************/

export class ICodeDecode {
    constructor(public code:string,
                public shortDecodeText:string,
                public longDecodeText:string,
                public startTimestamp:Date,
                public endTimestamp:Date) {
    };
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
    };
}

export class RelationshipAttributeNameUsage {
    constructor(public mandatory:boolean,
                public defaultValue:string,
                public attributeNameDef:HrefValue<RelationshipAttributeName>) {
    };
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
    };
}

export interface IName {
  givenName?:           string;
  familyName?:          string;
  unstructuredName?:    string;
}

export interface IIdentity {
  _id?:    string;
  type:   string;
  value:  string;
  name:   IName;
}

interface IIdentityRef {
    href:   string;
    value?: IIdentity;
}

interface IPartyRef {
    href:   string;
    value?: {
        partyType:  string;
        identities: IIdentityRef
    }
}

export interface IRelationship {
    relationshipType: {href: string}
    subject: IPartyRef;
    subjectNickName: IName;
    delegate: IPartyRef;
    delegateNickName: IName;
    startTimestamp: Date;
    endTimestamp?: Date;
    endEventTimestamp?: Date;
    status: string;
}

export interface IRelationshipRef {
    href:   string;
    value?: IRelationship;
}

export interface RelationshipSearchDTO {
    totalCount: number;
    pageSize:   number;
    list:       Array<IRelationshipRef>;
}