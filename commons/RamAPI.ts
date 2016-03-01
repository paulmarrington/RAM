import * as enums from "./RamEnums";

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

export class BusinessName {
    constructor(public name: string, public abn: string) { }
}

export class IndividualBusinessAuthorisation {
    constructor(
        public businessName: string,
        public abn: string,
        public activeOn: Date,
        public authorisationStatus: enums.AuthorisationStatus,
        public accessLevel: enums.AccessLevels,
        public expiresOn?: Date) { }
}


/**
 * A RAMObject defines the common attributes that all objects in the RAM model will contain.
 *  Most objects in RAM extend off the RAMObject
 */

export enum RelationshipType {
    BUSINESS_RELATIONSHIP, //a.k.a Universal
    ONLINE_SERVICE_PROVIDER //a.k.a cloud appointment
}

export enum RelationshipStatus {
    INVALID = 0, PENDING = 1, ACTIVE = 2, DELETED = 3
}

export enum RoleType {
    INVALID = 0
}

export enum AuthorisationCodeStatus {
    EXPIRED = 0,
    PENDING = 1,
    CLAIMED = 2,
    /** DoubleCheck:
 * The other parties details didn't match the expected values.
 * The other party has consented to returning their correct profile details to the relationship creator to see if they just misKeyed the details
 */
    DOUBLECHECK = 3
}

export interface IRAMObject {
    id: string;
    lastUdateTimestamp: Date;
    deleteInd: boolean;
    resourceVersion: string;
}

/** RAM will often need to record some attributes about a Relationship, e.g. what
 *  "host services" the relationship confers upon the delegate.
 *  The attributes to be recorded will be arbitaryily set by RAM admin staff  */
interface RelationshipAttribute extends IRAMObject {
    name: string;
    value: string;
    sharing: Consent[];
}

/** Due to "Machinary of Government" changes, agencies frequently change their names & abbrieviations.
 * This object records the current & historical names for agencies
 */
interface Agency extends IRAMObject {
    currentAbbrieviation: string;
    previousAbbrieviations: string[];
    currentName: string;
    previousNames: string[];
}
/** Control for sharing various different objects in the RAM database with other government
 * agencies may be set by parties in the system.  The Consent object will record what
 * agencies consent has been granted for sharing
 */
export interface Consent extends IRAMObject {
    agency: Agency;
}

export interface Name {
    givenName?: string;
    familyName?: string;
    unstructuredName?: string;
}

export interface Relationship extends IRAMObject {
    /** A Subject is the party being effected (changed) by a transaction performed by the Delegate */
    type: RelationshipType;

    subjectURIStem: string;
    subjectPartyRoleURIStem?: string;
    /** A Delegate is the party who will be interacting with government on line services on behalf of the Subject. */
    delegateURIStem: string;
    delegatePartyRoleURIStem?: string;
    /** when does this relationship start to be usable - this will be different to the creation timestamp */
    startTimestamp: Date;
    /** when does this relationship finish being usable */
    endTimestamp?: Date;
    /** when did this relationship get changed to being finished. */
    relationshipEndedAtTimestamp?: Date;
    /** is this relationship: Invalid (semantically incorrect)/ Pending/ Active/ Inactive*/
    status: RelationshipStatus;
    relationshipAttributes?: RelationshipAttribute[];
    /** which agencies can see the existence of this Relationship */
    sharing: Consent[];
    /** Party's identity (including Authorisation Code) contain names, but the other party
     * may prefer setting a different name by which to remember who they are dealing with. */
    subjectsNicknameForDelegate?: Name;
    /** Party's identity (including Authorisation Code) contain names,
     * but the other party may prefer setting a different name by which to remember
     * who they are dealing with. */
    delegatesNicknameForSubject?: Name;
}


// A Party is the concept that participates in Relationships.
// see https://books.google.com.au/books?id=_fSVKDn7v04C&lpg=PP1&dq=enterprise%20patterns%20and%20mda%20chapter%20party%20relationship&pg=RA1-PA159#v=onepage&q=enterprise%20patterns%20and%20mda%20chapter%20party%20relationship&f=false
export interface Party extends IRAMObject {
    relationships: Relationship[];
    identities: Identity[];
    roles: Role[];
    get?(partyURI: string): Party;
}

// The ABN is a Whole of Government Identifier that uniquely identifies businesses.  As there is no privacy constraints, RAM will use ABNs in relationships.
export interface ABN {
    value: string;
}

/** A Role is some characteristic that a Party has. Roles will only likely to be collected when there is something that needs to be build into a business rule for relationships.
 *  A Role is independant of relationships, e.g. you a doctor even if you have no patients.  In essanse a Role is just a collection of attributes.
 */
interface Role extends IRAMObject {
    name: string;
    roleAttributes: RoleAttribute[];
    sharing: Consent[];          //which agencies can see the existence of this Role
}

interface RoleAttribute extends IRAMObject {
    name: string;
    value: string;
    sharing: Consent[];          //which agencies can see the existence of this RoleAttribute
}

/** The link between the Credention from the Credential Service Provider will be
 * A Party will be identified through Party.id.  A Party may have one or more credentials.
 */
export interface Identity extends IRAMObject {
    identityReference: IdentityReference; //Not happy with this
    name?: Name;                 //The Identity "provider"" will supply a name by which to refer to the party.  TBD whether RAM this record this from ABN or WofG CSPs.
    dateOfBirth?: Date;
}

// An IdentityReference may be one of three types: an actual companies ABN, an AuthorisationCode or a LinkId from from a CSP
interface IdentityReference extends IRAMObject {
    ABN?: ABN;
    linkId?: LinkId;
    authorisationCode?: AuthorisationCode;
}

/**  An AuthorisationCode represents an, as yet, unidentified Party.
 * It is given to one party of a Relationship as a future reference to another party.
 * When that other party claims/ accpets the Relationship  the AuthorisationCode in the
 *  Relationship is swapped out for the parties real id.  The AuthorisationCode is then
 *  attached permanently as an identity to the other party.
 */
interface AuthorisationCode {
    value: string;
    expiry: Date;                //AuthorisationCodes have a limited life.  This value defines when the authorisation code is no longer claimable.
    status: AuthorisationCodeStatus;
    claimedTimestamp: Date;      //A record of when the pending Relationship was accepted.
}

/** A LinkId is the value supplied by a Whole of Government Credential Service Provider (CSP)
 * to RAM.  It will consist of up to 3 components.
 */
interface LinkId {
    scheme: string;              // this is a reference to the CSP that owns the identifer.  This has been called "scheme" to align with SBR Taxonomy.
    consumer?: string;           // to be "privacy enhancing" myGov allocates different identifiers to different agencies.  The consumer identifies the agency the identifier is for (assuming it is relevant)
    // should the be a reference to Agency??
}

// Most relationships are between two parties.
// However, one of those parties may be unknown during the set-up phase for a relationship.  During that time the relationship will be owned by a "PendingInvitations"
interface PendingInvitation extends IRAMObject {
    relationships: Relationship[];
    invitationCode: AuthorisationCode;
}
