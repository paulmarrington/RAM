import {Component} from '@angular/core';
import {RelationshipsTableComponent} from '../relationships-table/relationships-table.component';
import {RouteParams} from '@angular/router-deprecated';
import {ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import Rx from 'rxjs/Rx';
import {RAMRestService} from '../../services/ram-rest.service';
import {RAMIdentityService} from '../../services/ram-identity.service';
import {
    ISearchResult,
    IName,
    IParty,
    IRelationshipType,
    IHrefValue
} from '../../../../commons/RamAPI2';

@Component({
    selector: 'ram-relationships',
    templateUrl: 'relationships.component.html',
    directives: [RelationshipsTableComponent, ROUTER_DIRECTIVES],
})

export class RelationshipsComponent {

    public idValue:string;

    public identityDisplayName$:Rx.Observable<IName>;
    public subjectsResponse$:Rx.Observable<ISearchResult<IHrefValue<IParty>[]>>;

    public relationshipTypes: IHrefValue<IRelationshipType>[] = [];

    private _isLoading = false; // set to true when you want the UI indicate something is getting loaded.

    constructor(private routeParams:RouteParams,
                private identityService:RAMIdentityService,
                private rest:RAMRestService) {
    }

    public ngOnInit() {
        this.idValue = this.routeParams.get('idValue');
        this.identityDisplayName$ = this.identityService
            .getDefaultName(this.idValue).map(this.displayName);
        this.subjectsResponse$ = this.rest.searchDistinctSubjectsBySubjectOrDelegateIdentity(this.idValue, 1);
        this.subjectsResponse$.subscribe((searchResult) => {
            console.log('SEARCH RESULT!!!!');
            console.log('totalCount = ' + searchResult.totalCount);
            console.log('pageSize = ' + searchResult.pageSize);
        });
        this.rest.listRelationshipTypes().subscribe((relationshipTypes) => {
            this.relationshipTypes = relationshipTypes;
        });
    }

    public displayName(name:IName):string {
        if (name) {
            return name.unstructuredName ? name.unstructuredName : name.givenName + ' ' + name.familyName;
        }
        return '';
    }

    public displayNameForSubject(subject:IParty):string {
        if (subject && subject.identities && subject.identities.length > 0) {
            for (const identityHrefValue of subject.identities) {
                const identity = identityHrefValue.value;
                if (identity.defaultInd) {
                    const name = identity.profile.name;
                    return this.displayName(name);
                }
            }
            return this.displayName(subject.identities[0].value.profile.name);
        }
        return '';
    }

    public get isLoading() {
        return this._isLoading;
    }

}