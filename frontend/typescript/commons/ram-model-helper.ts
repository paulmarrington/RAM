import { Injectable } from '@angular/core';
import {
    IName,
    IParty,
    IIdentity,
    IRelationship,
    IRelationshipType,
    ILink,
    IHrefValue
} from '../../../commons/RamAPI2';

@Injectable()
export class RAMModelHelper {

    public linkByType(type: string, links: ILink[]): ILink {
        for(let link of links) {
            if(link.type === type) {
                return link;
            }
        }
        return null;
    }

    public displayName(name: IName): string {
        if (name) {
            return name.unstructuredName ? name.unstructuredName : name.givenName + ' ' + name.familyName;
        }
        return '';
    }

    public displayNameForParty(party: IParty): string {
        const resource = this.getDefaultIdentityResource(party);
        return resource ? this.displayName(resource.value.profile.name) : '';
    }

    public abnLabelForParty(party: IParty): string {
        if (party && party.identities && party.identities.length > 0) {
            for (const resource of party.identities) {
                const identity = resource.value;
                if (identity.identityType === 'PUBLIC_IDENTIFIER' && identity.publicIdentifierScheme === 'ABN') {
                    return 'ABN ' + identity.rawIdValue;
                }
            }
            return null;
        }
        return null;
    }

    public partyTypeLabelForParty(party: IParty): string {
        const partyType = party.partyType;
        if (partyType === 'INDIVIDUAL') {
            return 'Individual';
        } else {
            return 'Organisation';
        }
    }

    public relationshipTypeLabel(relationshipTypes: IHrefValue<IRelationshipType>[], relationship: IRelationship) {
        let relationshipType = this.getRelationshipType(relationshipTypes, relationship);
        if (relationshipType) {
            return relationshipType.shortDecodeText;
        }
        return '';
    }

    public getDefaultIdentityResource(party: IParty): IHrefValue<IIdentity> {
        if (party && party.identities && party.identities.length > 0) {
            for (const resource of party.identities) {
                const identity = resource.value;
                if (identity.defaultInd) {
                    return resource;
                }
            }
        }
        return null;
    }

    public getRelationshipType(relationshipTypeResources: IHrefValue<IRelationshipType>[], relationship: IRelationship) {
        let relationshipTypeHrefString = this.linkByType('self', relationship.relationshipType._links).href;
        for (let resource of relationshipTypeResources) {
            if (this.linkByType('self', resource._links).href === relationshipTypeHrefString) {
                return resource.value;
            }
        }
        return null;
    }

}
