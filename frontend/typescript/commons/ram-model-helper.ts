import { Injectable } from '@angular/core';
import {
    ISearchResult,
    IName,
    IParty,
    IRelationship,
    IRelationshipType,
    IHrefValue
} from '../../../../commons/RamAPI2';

@Injectable()
export class RAMModelHelper {

    public displayName(name:IName):string {
        if (name) {
            return name.unstructuredName ? name.unstructuredName : name.givenName + ' ' + name.familyName;
        }
        return '';
    }

    public displayNameForParty(party:IParty):string {
        if (party && party.identities && party.identities.length > 0) {
            for (const identityHrefValue of party.identities) {
                const identity = identityHrefValue.value;
                if (identity.defaultInd) {
                    const name = identity.profile.name;
                    return this.displayName(name);
                }
            }
            return this.displayName(party.identities[0].value.profile.name);
        }
        return '';
    }

    public abnLabelForParty(party:IParty):string {
        if (party && party.identities && party.identities.length > 0) {
            for (const identityHrefValue of party.identities) {
                const identity = identityHrefValue.value;
                if (identity.identityType === 'PUBLIC_IDENTIFIER' && identity.publicIdentifierScheme === 'ABN') {
                    return 'ABN ' + identity.rawIdValue;
                }
            }
            return null;
        }
        return null;
    }

    public relationshipTypeLabel(relationshipTypes:IHrefValue<IRelationshipType>[], relationship:IRelationship) {
        let relationshipType = this.getRelationshipType(relationshipTypes, relationship);
        if (relationshipType) {
            return relationshipType.shortDecodeText;
        }
        return '';
    }

    public getOtherPartyHrefValue(relationship:IRelationship) {
        if (this.subjectHrefValue) {
            if (relationship.subject.href === this.subjectHrefValue.href) {
                return relationship.delegate;
            } else {
                return relationship.subject;
            }
        }
        return null;
    };

    public getOtherParty(relationship:IRelationship) {
        const party = this.getOtherPartyHrefValue(relationship);
        return party ? party.value : null;
    }

    public getRelationshipType(relationshipTypes:IHrefValue<IRelationshipType>[], relationship:IRelationship) {
        let relationshipTypeHrefString = relationship.relationshipType.href;
        for (let aRelationshipTypeHrefValue of relationshipTypes) {
            if (aRelationshipTypeHrefValue.href === relationshipTypeHrefString) {
                return aRelationshipTypeHrefValue.value;
            }
        }
        return null;
    }

}
