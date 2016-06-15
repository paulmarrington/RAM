// system domain ......................................................................................................

export enum RAMMessageType {
    Error = 1,
    Info = 2,
    Success = 3
}

export interface IResponse<T> {
    data?:T;
    token?:string;
    alert?:Alert;
}

export interface Alert {
    messages:string[];
    alertType:RAMMessageType;
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

    public static fromJson(json:ErrorResponse) {
        return json ? new ErrorResponse(json.alert.messages, json.alert.alertType) : null;
    }
}

export interface IKeyValue<T> {
    key:string;
    value:T;
}

export class HrefValue<T> {
    constructor(public href:string,
                public value?:T) {
    }
}

export class SearchResult<T> {
    constructor(public totalCount:number, public pageSize:number, public list:T[]) {
    }

    public map<U>(callback:(value:T, index:number, array:T[]) => U):SearchResult<U> {
        return new SearchResult(this.totalCount, this.pageSize, this.list.map(callback));
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

    public displayName():string {
        return this.unstructuredName ? this.unstructuredName : this.givenName + ' ' + this.familyName;
    }

    public static fromJson(name:Name):Name {
        return name ? new Name(name.givenName, name.familyName, name.unstructuredName) : null;
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

    public static fromJson(json:Profile):Profile {
        // todo shared secrets not supported yet
        return json ? new Profile(json.provider, Name.fromJson(json.name), null) : null;
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
                public invitationCodeExpiryTimestamp:Date,
                public invitationCodeClaimedTimestamp:Date,
                public invitationCodeTemporaryEmailAddress:string,
                public publicIdentifierScheme:string,
                public linkIdScheme:string,
                public linkIdConsumer:string,
                public profile:Profile,
                public party:HrefValue<Party>) {
    }

    public static fromJson(json:Identity) {
        return json ? new Identity(
            json.idValue,
            json.rawIdValue,
            json.identityType,
            json.defaultInd,
            json.agencyScheme,
            json.agencyToken,
            json.invitationCodeStatus,
            null, null,
            json.invitationCodeTemporaryEmailAddress,
            json.publicIdentifierScheme,
            json.linkIdScheme,
            json.linkIdConsumer,
            Profile.fromJson(json.profile),
            new HrefValue<Party>(json.party.href, Party.fromJson(json.party.value)))
            : null;
    }

    public displayName():string {
        return (this.profile && this.profile.name) ? this.profile.name.displayName() : null;
    }
}

export class Party {
    constructor(public partyType:string,
                public identities:HrefValue<Identity>[]) {
    }

    public static fromJson(json:Party):Party {
        if (json) {
            const identities:HrefValue<Identity>[] = [];
            if (json.identities) {
                for (var identity of json.identities) {
                    identities.push(new HrefValue<Identity>(identity.href, Identity.fromJson(identity.value)));
                }
            }
            return new Party(json.partyType, identities);
        }
        return null;
    }
}

export class Relationship {
    constructor(public relationshipType:RelationshipType,
                public subject:Party,
                public subjectNickName:Name,
                public delegate:Party,
                public delegateNickName:Name,
                public startTimestamp:Date,
                public endTimestamp:Date,
                public endEventTimestamp:Date,
                public status:string,
                public attributes:RelationshipAttribute[]) {
    }
}

export class RelationshipAttribute {
    constructor(public value:string,
                public attributeName:HrefValue<RelationshipAttributeName>) {
    }
}

export class IdentityDTO {
    constructor(public partyTypeCode:string,
                public sharedSecretTypeCode:string,
                public sharedSecretValue:string,
                public givenName:string,
                public familyName:string,
                public unstructuredName:string) {
    }
}

export class AttributeDTO {
    constructor(public code:string,
                public value:string) {
    }

    public static build(data:AttributeDTO[]):AttributeDTO[] {
        const attributes:AttributeDTO[] = [];
        for (let attribute of data) {
            attributes.push(new AttributeDTO(attribute.code, attribute.value));
        }
        return attributes;
    }
}

export class RelationshipAddDTO {
    constructor(public relationshipTypeCode:string,
                public subjectIdValue:string,
                public delegate:IdentityDTO,
                public startTimestamp:Date,
                public endTimestamp:Date,
                public attributes:AttributeDTO[]) {
    }
}

// old deprecated .....................................................................................................

export class RelationshipTableReq {
    constructor(public pageSize:number,
                public pageNumber:number,
                public canActFor:boolean,
                public filters:{ [index:string]:string },
                public sortByField:string) {
    }
}

export interface IRelationshipTableRes {
    total:number;
    table:IRelationshipTableRow[];
    relationshipOptions:Array<string>;
    accessLevelOptions:Array<string>;
    statusValueOptions:Array<string>;
}

export class EmptyRelationshipTableRes implements IRelationshipTableRes {
    total = 0;
    table = new Array<IRelationshipTableRow>();
    relationshipOptions = new Array<string>();
    accessLevelOptions = new Array<string>();
    statusValueOptions = new Array<string>();
}

export interface IRelationshipTableRow {
    name:string;
    subName?:string;
    relId:string;
    rel:string;
    access:string;
    status:string;
}
