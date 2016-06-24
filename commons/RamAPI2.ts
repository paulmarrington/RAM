export interface ICodeDecode {
    code: string;
    shortDecodeText: string;
    longDecodeText: string;
    startTimestamp: string;
    endTimestamp: string;
}

export interface IHrefValue<T> {
    href: string;
    value?: T;
}

interface IParty {
    partyType: string;
    identities: Array<IHrefValue<IIdentity>>;
}

export interface IName {
    givenName?: string;
    familyName?: string;
    unstructuredName?: string;
}

export interface IRelationship {
    relationshipType: IHrefValue<IRelationshipType>;
    subject: IHrefValue<IParty>;
    subjectNickName?: IName;
    delegate: IHrefValue<IParty>;
    delegateNickName?: IName;
    startTimestamp: string;
    endTimestamp?: string;
    endEventTimestamp?: string,
    status: string;
    attributes: IRelationshipAttribute[];
}

export interface RelationshipSearchDTO {
    totalCount: number;
    pageSize: number;
    list: Array<IHrefValue<IRelationship>>;
}

export interface IRelationshipType extends ICodeDecode {
    voluntaryInd: boolean;
    relationshipAttributeNames: IRelationshipAttributeNameUsage[];
}

export interface IRelationshipAttributeNameUsage {
    mandatory: boolean;
    defaultValue: string;
    attributeNameDef: IHrefValue<IRelationshipAttributeName>;

}

export interface IRelationshipAttributeName extends ICodeDecode {
    name: string;
    domain: string;
    classifier: string;
    category: string;
    permittedValues: string[];
}
interface ISharedSecret {
    value: string;
    sharedSecretType: ISharedSecretType;
}

export interface ISharedSecretType extends ICodeDecode {
    domain: string;
}

export interface IProfile {
    provider: string;
    name: IName;
    sharedSecrets: ISharedSecret[];
}

export interface IIdentity {
    idValue: string;
    rawIdValue: string;
    identityType: string;
    defaultInd: boolean;
    agencyScheme: string;
    agencyToken: string;
    invitationCodeStatus: string;
    invitationCodeExpiryTimestamp: string;
    invitationCodeClaimedTimestamp: string;
    invitationCodeTemporaryEmailAddress: string;
    publicIdentifierScheme: string;
    linkIdScheme: string;
    linkIdConsumer: string;
    profile: IProfile;
    party: IHrefValue<IParty>;
}

export interface IRelationshipAttribute {
    value: string;
    attributeName: IHrefValue<IRelationshipAttributeName>;
}

export interface ICreateIdentityDTO {
    rawIdValue?:string;
    partyType:string;
    givenName?:string;
    familyName?:string;
    unstructuredName?:string;
    sharedSecretTypeCode:string;
    sharedSecretValue:string;
    identityType:string;
    agencyScheme?:string;
    agencyToken?:string;
    linkIdScheme?:string;
    linkIdConsumer?:string;
    publicIdentifierScheme?:string;
    profileProvider?:string;
}

export interface IAttributeDTO {
    code:string;
    value:string;
}

export interface IRelationshipAddDTO {
    relationshipType:string;
    subjectIdValue:string;
    delegate:ICreateIdentityDTO;
    startTimestamp:Date;
    endTimestamp:Date;
    attributes:IAttributeDTO[];
}

export interface INotifyDelegateDTO {
    email:string;
}
