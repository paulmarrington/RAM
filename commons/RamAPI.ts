export interface IResponse {
    isError: boolean;
}

export class ErrorResponse implements IResponse {
    constructor(public errorCode: number,
        public errorMessage: string) { }

    isError: boolean = true;
}

export class ErrorResponseWithData<T> implements IResponse {
    constructor(public data: T, public errorCode: number, public errorMessage: string) { }
    isError: boolean = true;
}

export class DataResponse<T>{
    constructor(public data: T) { }
    isError: boolean = false;
}

/**
 * A RAMObject defines the common attributes that all objects in the RAM model will contain.
 *  Most objects in RAM extend off the RAMObject.
 * PK is _id(used by mongo) and (id,lastUpdatedTimestamp)
 */
export interface IRAMObject {
    _id: string;
    id: string;
    lastUpdatedTimestamp: Date;
    lastUpdatedByPartyId: string;
    deleteIndicator: boolean;
}

/*
 * A Party is the concept that participates in Relationships.
 * see https://books.google.com.au/books?id=_fSVKDn7v04C&lpg=PP1&dq=enterprise%20patterns%20and%20mda%20chapter%20party%20relationship&pg=RA1-PA159#v=onepage&q=enterprise%20patterns%20and%20mda%20chapter%20party%20relationship&f=false
 */
export interface Party extends IRAMObject {
    relationships: Relationship[];
    identities: IdentityValue[];
    roles: SharableEntityAttributeValue<string>[];
    partyTypeInformation: SharableEntityWithAttributes<string>;
}

export interface Relationship extends IRAMObject {
    /** A Subject is the party being effected (changed) by a transaction performed by the Delegate */
    relationshipTypeInformation: SharableEntityWithAttributes<string>;

    subjectPartyId: string;
    subjectRoleId: string;
    subjectRolePermission: EntityWithAttributes<boolean, EntityAttributeValue<boolean>>;
    /** A Delegate is the party who will be interacting with government on line services on behalf of the Subject. */
    delegatePartyId: string;
    delegateRoleId: string;
    /** when does this relationship start to be usable - this will be different to the creation timestamp */
    startTimestamp: Date;
    /** when does this relationship finish being usable */
    endTimestamp?: Date;
    /** which agencies can see the existence of this Relationship */
    sharing: Consent[];
    /** Party's identity (including Authorisation Code) contain names,
     * but the other party may prefer setting a different name by which to remember
     * who they are dealing with. */
    subjectsNickName: string;
    /** Party's identity (including Authorisation Code) contain names,
     * but the other party may prefer setting a different name by which to remember
     * who they are dealing with. */
    delegatesNickName: string;
}

/** Most relationships are between two parties.
 * However, one of those parties may be unknown during the set-up phase for a relationship.
 * During that time the relationship will be owned by a "PendingInvitations"
 */
export interface PendingInvitation extends IRAMObject {
    relationshipCreatorId: string;
    relationshipCreatorRoleDefId: string;
    relationshipAttributes: SharableEntityWithAttributes<string>;
    secrets: KeyValue<String>[];
    expiryTimestamp: Date;
}

interface IdentityValue {
    claimedTimestamp: Date;
    identityDefinitionId: string;
    answersToSecrets: EntityAttributeValue<String>[];
}

export interface IdentityDefinition extends IRAMObject {
    machine_name: string;
    human_name: string;
    listOfInformation: KeyValue<String>[];
    listOfSecrets: KeyValue<String>[];
}

/** A Role is some characteristic that a Party has. Roles will only likely to be collected when there is something that needs to be build into a business rule for relationships.
 *  A Role is independant of relationships, e.g. you a doctor even if you have no patients.  In essanse a Role is just a collection of attributes.
 */
interface SharableEntityWithAttributes<T> extends EntityWithAttributes<T, SharableEntityAttributeValue<T>> {
    sharing: string[];          //which agencies can see the existence of this Role
}

interface EntityWithAttributes<T, U extends EntityAttributeValue<T>> {
    entityWithAttributeDefId: string;
    attributes: U[];
}

export interface EntityWithAttributeDef extends IRAMObject {
    human_name: string;
    listOfAttributes: AttributeDef<String>[];
}

export interface AttributeDef<T> {
    machine_name: string;
    human_name: string;
    listOfAcceptableOptions: Array<KeyValue<T>>;
    isFreeText: boolean;
    isRequired: boolean;
}

export interface KeyValue<T> {
    machine_name: string;
    human_name: string;
    value: T;
}

interface EntityAttributeValue<T> {
    machine_name: string;
    value: T;
}

interface SharableEntityAttributeValue<T> extends EntityAttributeValue<T> {
    sharing: string[];          //referencing consent id, which agencies can see the existence of this RoleAttribute

}

/** Control for sharing various different objects in the RAM database with other government
 * agencies may be set by parties in the system.  The Consent object will record what
 * which LegislativePrograms consent has been granted for sharing
 */
export interface Consent extends IRAMObject {
    legislativeProgram: LegislativeProgram;
}

/** A LegislativeProgram represents some course-grained grouping of functionality offered by government to citizens.
 *  Due to "Machinary of Government" changes these LegislativePrograms are moved between agencies. Generally, LegislativePrograms survive these moves, just in a newly named agency.
 */
export interface LegislativeProgram {
    name: string;
}

export interface Name {
    givenName?: string;
    familyName?: string;
    unstructuredName?: string;
}
