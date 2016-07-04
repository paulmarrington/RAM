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
        const defaultIdentityHrefValue = this.getDefaultIdentityHrefValue(party);
        return defaultIdentityHrefValue ? this.displayName(defaultIdentityHrefValue.value.profile.name) : '';
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

    public partyTypeLabelForParty(party:IParty):string {
        const partyType = party.partyType;
        if (partyType === 'INDIVIDUAL') {
            return 'Individual';
        } else {
            return 'Organisation';
        }
        return '';
    }

    public relationshipTypeLabel(relationshipTypes:IHrefValue<IRelationshipType>[], relationship:IRelationship) {
        let relationshipType = this.getRelationshipType(relationshipTypes, relationship);
        if (relationshipType) {
            return relationshipType.shortDecodeText;
        }
        return '';
    }

    public getDefaultIdentityHrefValue(party:IParty):string {
        if (party && party.identities && party.identities.length > 0) {
            for (const identityHrefValue of party.identities) {
                const identity = identityHrefValue.value;
                if (identity.defaultInd) {
                    return identityHrefValue;
                }
            }
        }
        return null;
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
