import * as enums from "./RamEnums";

export enum RelationshipStatus {
    INVALID = 0,
    PENDING = 1,
    ACTIVE = 2,
    DELETED = 3,
    CANCELLED = 4
}


export enum AuthorisationCodeStatus {
    EXPIRED = 0,        // to be confirmed whether this includes cancelled status
    PENDING = 1,
    CLAIMED = 2,
     /** DoubleCheck:
      * The other parties details didn't match the expected values.
      * The other party has consented to returning their correct profile details to the relationship creator to see if they just misKeyed the details
      */
    DOUBLECHECK = 3
}

/**
 * A RAMObject defines the common attributes that all objects in the RAM model will contain.
 *  Most objects in RAM extend off the RAMObject
 */
export interface IRAMObject {
    id: string;
    lastUdatedTimestamp: Date;
    lastUpdatedByPartyId: string;
    deleteIndicator: boolean;
    resourceVersionNumber: number;
}

// Parties may be unknown during the set-up phase for a relationship.  During that time the relationship will be owned by an "UnknownParty"
export interface UnknownParty extends IRAMObject {
    unknownParties: IRAMObject[];
}

/** RAM will often need to record some attributes about a Relationship, e.g. what
 *  "host services" the relationship confers upon the delegate.
 *  The attributes to be recorded will be arbitaryily set by RAM admin staff  */
export interface RelationshipAttribute extends SharableAttribute {
    name: RelationshipAttributeCode;
}

/** A LegislativeProgram represents some course-grained grouping of functionality offered by government to citizens.   
 *  Due to "Machinary of Government" changes these LegislativePrograms are moved between agencies. Generally, LegislativePrograms survive these moves, just in a newly named agency.
 */
export interface LegislativeProgram extends IRAMObject {
    name: string;
}
/** Control for sharing various different objects in the RAM database with other government
 * agencies may be set by parties in the system.  The Consent object will record what
 * which LegislativePrograms consent has been granted for sharing
 */
export interface SharingConsent extends IRAMObject {
    legislativeProgram: LegislativeProgram;
}

export interface Name {
    givenName?: string;
    familyName?: string;
    unstructuredName?: string;
}

export interface Relationship extends IRAMObject {
    /** A Subject is the party being effected (changed) by a transaction performed by the Delegate */
    type: RelationshipTypeCode;
    subjectPartyId:string;
    subjectRoleId?: string;
    /** A Delegate is the party who will be interacting with government on line services on behalf of the Subject. */
    delegatePartyId: string;
    delegateRoleId?: string;
    /** when does this relationship start to be usable - this will be different to the creation timestamp */
    startTimestamp: Date;
    /** when does this relationship finish being usable */
    endTimestamp?: Date;
    /** when did this relationship get changed to being finished. */
    endEventTimestamp?: Date;
    /** is this relationship: Invalid (semantically incorrect)/ Pending/ Active/ Inactive*/
    status: RelationshipStatus;
    relationshipAttributes?: RelationshipAttribute[];
    /** which agencies can see the existence of this Relationship */
    sharing: SharingConsent[];
    /** Party's identity (including Authorisation Code) contain names, 
     * but the other party may prefer setting a different name by which to remember 
     * who they are dealing with. */
    subjectsNickName?: Name;
    /** Party's identity (including Authorisation Code) contain names,
     * but the other party may prefer setting a different name by which to remember
     * who they are dealing with. */
    delegatesNickName?: Name;
}

//at the moment this is here just to give semantic meaning to the "foreign key" reference from Party to Relationship.  This FK could be done using the mongo surogate id.
//if this type survives, we should give consideration to using it in the relationshp type.
export interface RelationshipIdentifier{
    type: RelationshipTypeCode;
    subjectPartyId:string;
    delegatePartyId:string;  
    startTimestamp: Date;
}

// A Party is the concept that participates in Relationships.
// see https://books.google.com.au/books?id=_fSVKDn7v04C&lpg=PP1&dq=enterprise%20patterns%20and%20mda%20chapter%20party%20relationship&pg=RA1-PA159#v=onepage&q=enterprise%20patterns%20and%20mda%20chapter%20party%20relationship&f=false
export interface Party extends IRAMObject {
    //Logically Parties own relationships, ie. if these relationships are embedded it would look like: relationships: Relationship[];
    //Physically we are not expecting to embedd the relationships in the party, so we have the choice of using the relationship business identifier: Relationshiptype, SubjectPartyId, DelegatePartyId or the mongo allocated id inherited from IRAMObject.
    //could implement this as relationships: string[]; (where the mongo id is a string) or
    relationships: RelationshipIdentifier[];
    identities: Identity[];
    roles: Role[];
}

/** A Role is some characteristic that a Party has. Roles will only likely to be collected when there is something that needs to be build into a business rule for relationships.
 *  A Role is independant of relationships, e.g. you a doctor even if you have no patients.  In essanse a Role is just a collection of attributes.
 */
export interface Role extends IRAMObject {
    type:RoleTypeCode
    roleAttributes: RoleAttribute[];
    sharing: LegislativeProgram[];          //which agencies can see the existence of this Role - not sure if this is overkill.
}

export interface RoleAttribute extends SharableAttribute {
    name: RoleAttributeName;
}

export interface SharableAttribute extends IRAMObject{
    value: string;
    sharing: SharingConsent[];          //which agencies can see the existence of this RoleAttribute   
}

export interface IdentityType extends ICodeDecodeReferenceData {
    code:IdentityTypeCode
}
/** The link between the Credention from the Credential Service Provider will be
 * A Party will be identified through Party.id.  A Party may have one or more credentials.
 */
export interface Identity extends IRAMObject {
    idValue:string;             //this is the actual identifier that this identity uses.
    type:IdentityTypeCode;          //now that we've made ABN, InviteCode, LinkId subtypes, this explicit type is probably not required.
    profile?: Profile;          //The Identity "provider"" will supply a profile (name by which to refer to the party & DoB).  TBD whether RAM this record this from ABN or WofG CSPs.
    defaultIndicator: boolean   //what is the default identity to be used (which one has the name that will be used in absence of othr information)
}

/**  Some parties (businesses) may be allocated a "Public Identifer", e.g. ABN.   
 *   Where there is no privacy constraints, RAM will record these identifiers to assist identifying Parties
 *   No addtional attributes are required beyond those provided by the SuperType (IdenityReference)
 */
export interface PublicIdentifier extends Identity{
    scheme: publicIdentifierSchemeCode;    // this field tells us what kind of public identifer this is. 
};

/**  An InvitationCode represents an, as yet, unidentified Party.
 * It is given to one party of a Relationship as a future reference to another party.
 * When that other party claims/ accpets the Relationship  the InvitationCode in the
 *  Relationship is swapped out for the parties real id.  The InvitationCode is then
 *  attached permanently as an identity to the other party.
 */
export interface InvitationCode extends Identity {
    expiryTimestamp: Date;         //AuthorisationCodes have a limited life.  This value defines when the authorisation code is no longer claimable.
    status: AuthorisationCodeStatus;
    claimedTimestamp: Date;        //A record of when the pending Relationship was accepted.
}

/** A LinkId is the value supplied by a Whole of Government Credential Service Provider (CSP)
 * to RAM.  It will consist of up to 3 components. Id (coming from IdentityType, Schema and Consumer)
 */
export interface LinkId extends Identity { 
    scheme: linkIdSchemeCode;    // this is a reference to the CSP that owns the identifer.  This has been called "scheme" to align with SBR Taxonomy.
    consumer?: string;           // to be "privacy enhancing" myGov allocates different identifiers to different relying parties (which may or may not be an agency)
}

// Most relationships are between two parties.
// However, one of those parties may be unknown during the set-up phase for a relationship.  During that time the relationship will be owned by a "PendingInvitations"
export interface AgencyProvidedToken extends IRAMObject {
    who: LegislativeProgram;     // Which agency issued this token
}

export enum SharedSecretTypeCode{
    DATE_OF_BIRTH=1
}

export interface SharedSecret {
    type:SharedSecretTypeCode,
    value:string;
}

export interface SharedSecretType extends ICodeDecodeReferenceData{
    code: SharedSecretTypeCode,
    domain:string
}

/** A profile is a collection of detail about the party
 *  A myGov profile consists of Name and Date of Birth
 *  The CSP may or may not supply the profile.  Not all identities will be supplied by the CSP.  Some profiles may be self asserted.
 */
export interface Profile extends IRAMObject{
    provider: ProfileProvider,
    name:Name,
    dateOfBirth:SharedSecret}

export enum ProfileProviderCode{
    SELF_ASSERTED =1,
    MYGOV = 2,
    VANGUARD=3,
    AUTHAPP=4
}
export interface ProfileProvider extends ICodeDecodeReferenceData{
    code: ProfileProviderCode
}

//---------------------------------------------------------------------------------------------------------------------------------------------------------------

// this is a common interface which is used by reference data.
export interface ICodeDecodeReferenceData{
    shortDecodeText?:string;
    longDecodeText?:string;
    startDate:Date;
    endDate:Date
}

export enum RelationshipTypeCode {
    BUSINESS_RELATIONSHIP = 1 , //a.k.a Universal
    ONLINE_SERVICE_PROVIDER = 2 //a.k.a cloud appointment
}

/** This reference data defines the permittable set of relationships that may be created
*/
export interface RelationshipType extends ICodeDecodeReferenceData {
    type:RelationshipTypeCode
}

export enum RelationshipAttributeCode {
    INVALID = 0,
    SoftwareSubscriptionIdentifier = 1    
}

/** This reference data defines the names of the permittable relationship attributes
*/
export interface RelationshipAttributeName extends ICodeDecodeReferenceData {
    name:RelationshipAttributeCode,
    domain:string
}

/** This reference data defines which relationships may have what attributes
*/
export interface RelationshipAttributeUsage extends ICodeDecodeReferenceData {
    type:RelationshipTypeCode,
    name:RelationshipAttributeCode,
    optionalIndicator:boolean,
    defaultValueText?:string
}


/** This reference data defines which relationships may have what attributes
*/
export interface RelationshipAttributePermittedValue extends ICodeDecodeReferenceData {
    name:RelationshipTypeCode,
    permittedValueText:string
}

export enum RoleTypeCode {
    PERSON = 1,
    ORGANISATION = 2
}

/** This reference data defines the permittable set of roles that may be created
*/
export interface RoleType  extends ICodeDecodeReferenceData {
    type:RoleTypeCode
}

export enum RoleAttributeNameCode {
    INVALID = 0
}

/** This reference data defines the names of the permittable roleAttribute(s)
*/
export interface RoleAttributeName  extends ICodeDecodeReferenceData {
    name:RoleAttributeNameCode,
    domain:string
}

/** This reference data defines which relationships may have what attributes
*/
export interface RoleAttributeNameCodeUsage extends ICodeDecodeReferenceData {
    type:RoleTypeCode,
    name:RoleAttributeNameCode,
    optionalIndicator:boolean,
    defaultValueText?:string
}

/** This reference data defines which relationships may have what attributes
*/
export interface RoleAttributePermittedValue extends ICodeDecodeReferenceData {
    name:RoleAttributeNameCode,
    permittedValueText:string
}

/** This type is used to define the pagination properties
 */ 
export interface PageOptions {
    pageNumber:string,
    pageSize:string
    //properties for specifying sort critera are yet to be defined 
}

export enum IdentityTypeCode {
    ABN = 1,            // The ABN is a Whole of Government Identifier that uniquely identifies businesses.  As there is no privacy constraints, RAM will use ABNs in relationships.
    LINK_ID = 2,        // A LINK_ID is a value issued by a WofG Credential Service Provider
    AUTHORISATION_CODE = 3    
}

export enum publicIdentifierSchemeCode{
    ABN=1,
}

export enum linkIdSchemeCode{
    MYGOV=1,
    VANGUARD=2,
    AUTHENTICATOR_APP=3
}

//ToDo
interface Response{
    
}

//possible API interface from the credential service providers (specifically myGov)
interface Identity_Resolver {
    swapLinkIds(linkIds:LinkId[]): {
                        response:Response,
                        linkIds:LinkId[] }                           
    
    getProfile(linkId:  LinkId): {
                        response:Response,
                        profiles:Profile[] }    
}

//---------------------------------------------------------------------------------------------------------------------------------------------------------------
  
interface RAM{
//    
/**
 * https://<fqdn>/api/v1
 *     /Parties/Identities/:Identity.type/:Identity.idValue
 *     /Relationships/:Relationship.type
 *     /Parties/Identities/:Identity.type/:Identity.idValue
 *     /:Relationship.startTimestamp
 *     [?filter=
 *         'filterRelationshipAttribute.name=:attr-name, filterRelationshipAttribute.value=:attr-value,...
 *          filterSubjectPartyRole.type=:Role.type, ... 
 *          filterDelegatePartyRole.type=:Role.type, ... 
 *          filterEndTimestamp=:Relationship.endTimestamp, '
 *      &fields='
 *          requestedFields.name=:attr-name, requestedFields.value=:attr-value,...']
 * 
 * This resource identifies a single instance of a relationship.  A get of this resource may be used to confirm the existence 
 * of a relationship between the subject and delegate parties.  The result of a get will be to return details about that relationship, 
 * including relationship attributes.
 */
// Get
    readRelationship(subjectPartyIdentifer:string, 
                    delegatePartyIdentifier:string, 
                    relationshipType:RelationshipTypeCode, 
                    startTimestamp: Date,
                    filterSubjectPartyRole?: string[],          
                    filterDelegatePartyRole?:string[], 
                    filterRelationshipAttribute?:string[],
                    filterEndTimestamp: Date,
                    requestedFields?:string[]  ): 
                        {response:Response, requestedRelationship:Relationship};
// in the above service, a null requestedFields implies return all relationshipAttribute(s) 
// where the requestedFields contains a list of relationshhip attributes only those 
// relationshipAttribute(s) should be returned.  Thus an empty list would see no 
// relationshipAttribute(s) returned.
//
// This service may be called by 
// * VANguard, in which case they will populate the subject & delegate party identifiers appropriately.
// * a relying agency   
//      ** the relying party may be querying this outside of a party authentication session, in which case they 
//         will need a way of communicating the identity known to them and us.

//This is the same method as the previous one, but typed.                         
    readRelationship(subjectPartyIdentifer:Identity, 
                    delegatePartyIdentifier:Identity, 
                    relationshipType:RelationshipTypeCode, 
                    startTimestamp: Date,
                    filterSubjectPartyRole?: Role[], 
                    filterDelegatePartyRole?:Role[], 
                    filterRelationshipAttribute?:RelationshipAttribute[], 
                    filterEndTimestamp: Date,
                    requestedFields?:RelationshipAttributeCode[]  ): 
                        {response:Response, requestedRelationship:Relationship};
                        
/** https://<fqdn>/api/v1
 *     /Parties/Identities/:Identity.type/:Identity.idValue
 *     /Relationships/:Relationship.type,:Relationship.type,:Relationship.type
 *     [?filter=
 *          'filterSubjectIndicator={True | False}, 
 *           filterRelationshipAttribute.name=:attr-name, filterRelationshipAttribute.value=:attr-value, ...
 *           filterSubjectPartyRole.type=:Role.type, ... 
 *           filterDelegatePartyRole.type=:Role.type, ... 
 *           filterStartTimestampe=:Relationship.startTimestamp,filterEndTimestamp=:Relationship.endTimestamp
 *           pageNumber=:pageNumber, pageSize=:pageSize
 *     &fields='
 *          'requestedFields.name=:attr-name, requestedFields.value=:attr-value,...']
 * 
 * This resource represents a collection of relationships for a given party for a specified list of relationship types.   
 * The other party attached to each relationship is also returned. It is optionally possible to filter the request to return 
 * just those relationships where a party is either the Subject or Delegate on that relationship. 
 */
// Get  
    listRelationships(partyIdentifer:string, 
                    desiredRelationshipTypes:RelationshipTypeCode[], 
                    filterSubjectIndicator?: boolean,
                    filterSubjectPartyRole?: string[], 
                    filterDelegatePartyRole?:string[], 
                    filterRelationshipAttributes?:string[], 
                    pageNumber?:string,
                    pageSize?:string,
                    requestedFields?:string[]  ): 
                        {response:Response, 
                         relationshipsWithParties:{relationship:Relationship,relatedParty:Party}[] };
                                           
//This is the same method as the previous one, but typed.      
    listRelationships(partyIdentifer:Identity,  
                    desiredRelationshipTypes:RelationshipTypeCode[], 
                    filterSubjectIndicator?: boolean,
                    filterSubjectPartyRole?: Role[], 
                    filterDelegatePartyRole?:Role[], 
                    filterRelationshipAttributes?:RelationshipAttribute[], 
                    pageOptions?:PageOptions,
                    requestedFields?:RelationshipAttributeCode[]  ): 
                        {response:Response, 
                         relationshipsWithParties:{relationship:Relationship,relatedParty:Party}[] }; 

/** https://<fqdn>/api/v1
 *     /Parties/Identities/:Identity.type/:Identity.idValue
 *     /Relationships/:Relationship.type
 *     /Parties/Identities/:Identity.type/:Identity.idValue
 * 
 * Again this resource represents a single instance of a relationship between parties.  A Post/Put/Delete against this resource
 * will Create/Update/Delete a relationship.
 *    
 * When creating a relationship, one of the parties may be unknown.  The consumer may leave the whole Identity reference null or 
 * specify the Identity.type to be an invitationCode and the identity.idValue to be null.
 * 
 * In this case RAM will create the the Party and associate the newly created Party to the newly created Relationship.  It will 
 * return a hypermedia link to this newly created Party.  This newly created party will be identified by a newly generated Invitation Code.
 * 
 * One or both of the parties to a new relationship may not yet exist in RAM.  RAM will create these parties as a side effect to creating
 * the relationship - as long as the the logged on user has the authority.  This authority may be because either: they are the party that
 * needs to be created (as identified by the authentication process), or they are some trusted party (e.g. agency staff).
 * 
 * Just like the unknown party, the new party(s) are created and a hypermedia reference return to it along with the new relationship.
 *  
 * Note, an Identity in the put/ posted payload may contain a profile which may contain a name, etc. which will result init being updated.
 */  
//Post           
    createRelationship(relationship:Relationship,
                        subjectPartyIdentifer?:Identity,
                        delegatePartyIdentifer?:Identity): 
                        {response:Response, 
                         relationship:Relationship, 
                         subjectPartyIdentifier?:Identity,     
                         delegatePartyIdentifier?:Identity};  
//                        
//Put                        
    updateRelationship(relationship:Relationship): 
                        {response:Response, relationship:Relationship};       
//Delete                                                              
    deleteRelationship(relationship:Relationship): 
                        {response:Response};     
//Note - a delete results in a logical deletion only.                        

/** https://<fqdn>/api/v1
 *     /Parties/Identities/:Identity.type/:Identity.idValue
 *     ?fields='
 *          'requestedRoleAttribute.name=:attr-name, :attr-name...'
 * 
 * This resource identifies a Party.  A Get may be used to retrieve the details about this party.  A Delete will logically delete
 * the Party.
 * 
 * Generally parties will be created as a side effect of creating a relationship.  It is possible that a party may be created independantly of a relationship, 
 * e.g. in order to create role properties in preparation of creating relationships.
 * 
 */ 
// Get  
     readParty(partyIdentifer:Identity,  
                        requestedRoleAttributes?:RoleAttributeNameCode[]  ): 
                        {response:Response, party:Party};  
// in the above service, a null requestedRoleAttributes implies return all roleAttribute(s) 
// where a where the requestedRoleAttributes contains a list of roleAttribute(s) only those 
// roleAttribute(s) should be returned.  thus an empty list would see no 
// roleAttribute(s) returned.
// Probably this is too overloaded and an explicit flag should be added.
// 
// Note - the above readParty takes in the logical identifier for party (based on Identity), not the technical identifer (Party.id)
//
// Post  
     createParty(party:Party):
                 {response:Response, party:Party};  
// Put  
     updateParty(party:Party):
                 {response:Response, party:Party};  
              
// Delete  
     deleteParty(partyIdentifer:Identity):
                 {response:Response};     
/**  https://<fqdn>/api/v1
 *     /Parties/InvitationCode/:Identity.idValue,
 *       ?fields='
 *          'requestedRoleAttribute.name=:attr-name, :attr-name...'
 * 
 * This service may be use to find a party with the specified invitation code (sub type of identity) and update details of that invitation
 * code to signal it has been accepted, rejected, etc.
 * 
 * If the supplied invitation code details are correct, the status & claimedtimestamp propertie are update.
 * 
 * The link id for the logged on user is populated into the identity property (together with profile info).
 * This identity is used to find a Party record for the logged on user.
 * * if one is found the Relationship attached to the Party that contains the InvitationCode
 *   is transfered to the Party identified by the logged on user's Party
 * * if one isn't found the Identity for the logged on user is attached to the Party that 
 *   owns the InvitationCode, and thus now the logged on user has a Party record.
 */ 
// Put 
     updateInvitationCode(partyIdentifer:Identity,  
                          invitationCode:InvitationCode):  
                        {response:Response, party:Party, relationship:Relationship};  
                        
/** https://<fqdn>/api/v1
 *     /Parties/Identities/:Identity.type/:Identity.idValue/Identity
 * 
 * Create and Update actions may be performed against an identity resource.
 * 
 * In general RAM doesn't create Identity(s) (that is done by the credential service provider, etc),
 * but it does create a record of that Identity in its database.  The exception to this is 
 * RAM creates InvitationCode(s).  There is no service to create InvitationCode(s) as InvitationCode(s)
 * cannot exist independantly of Relationship(s), therefore their creation is a side effect of
 * creating a Relationship to an unidentified party   
 */ 
//Post
    createIdentity(partyIdentifier: Identity,
                   newPartyIdentifer:Identity[]):
                        {response:Response, party:Party};
          
//Put
    updateIdentity(partyIdentifier: Identity[]):
                        {response:Response, party:Party};                        
                        
/**  https://<fqdn>/api/v1
 *     /Parties/Identities/:Identity.type/:Identity.idValue
 *     /Roles/:Role.type
 * 
 *  All C_UD action may be used against this resource to maintain role details.
 * 
 *  As yet, ther is no identified need for Read or List of Roles as roles are returned from a get against a party (document). 
 */ 
//Post           
     createPartyRoles(partyIdentifer:Identity,  
                      partyRole: Role): 
                        {response:Response, roles:Role[]};


//Put           
     updatePartyRoles(partyIdentifer:Identity,  
                      partyRoles: Role[]): 
                        {response:Response, role:Role};    


//Delete           
     deletePartyRoles(partyIdentifer:Identity,  
                      partyRoles: Role[]): 
                        {response:Response};
                        
}
