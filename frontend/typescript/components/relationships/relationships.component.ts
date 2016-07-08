import {OnInit, OnDestroy, Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ROUTER_DIRECTIVES} from '@angular/router';
import Rx from 'rxjs/Rx';
import {PageHeaderComponent} from '../page-header/page-header.component';
import {SearchResultPaginationComponent, SearchResultPaginationDelegate} from '../search-result-pagination/search-result-pagination.component';
import {RelationshipsTableComponent} from '../relationships-table/relationships-table.component';
import {RAMModelHelper} from '../../commons/ram-model-helper';
import {RAMRestService} from '../../services/ram-rest.service';
import {
    ISearchResult,
    IParty,
    IIdentity,
    IRelationship,
    IRelationshipType,
    IHrefValue
} from '../../../../commons/RamAPI2';

@Component({
    selector: 'ram-relationships',
    templateUrl: 'relationships.component.html',
    directives: [ROUTER_DIRECTIVES, PageHeaderComponent, SearchResultPaginationComponent, RelationshipsTableComponent]
})

export class RelationshipsComponent implements OnInit, OnDestroy {

    public idValue: string;

    public identity$: Rx.Observable<IIdentity>;
    public subjectsResponse$: Rx.Observable<ISearchResult<IHrefValue<IParty>>>;
    public relationshipsResponse$: Rx.Observable<ISearchResult<IHrefValue<IRelationship>>>;

    // todo rename to relationshipTypeHrefs
    public relationshipTypes: IHrefValue<IRelationshipType>[] = [];
    public subjectGroupsWithRelationships: SubjectGroupWithRelationships[];
    public subjectHrefValue: IHrefValue<IParty>;

    public paginationDelegate: SearchResultPaginationDelegate;

    private _isLoading = false; // set to true when you want the UI indicate something is getting loaded.

    private rteParamSub: Rx.Subscription;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private modelHelper: RAMModelHelper,
                private rest: RAMRestService) {
    }

    // todo need some way to indicate ALL the loading has finished; not a priority right now
    /* tslint:disable:max-func-body-length */
    public ngOnInit() {

        this._isLoading = true;

        this.rteParamSub = this.route.params.subscribe(params => {

            this.idValue = decodeURIComponent(params['idValue']);
            this.identity$ = this.rest.findIdentityByValue(this.idValue);

            // todo remove deprecated
            this.subjectsResponse$ = this.rest.searchDistinctSubjectsBySubjectOrDelegateIdentity(this.idValue, 1);
            this.subjectsResponse$.subscribe((searchResult) => {
                this._isLoading = false;
            }, (err) => {
                alert(JSON.stringify(err, null, 4));
                this._isLoading = false;
            });

            // relationship types
            this.rest.listRelationshipTypes().subscribe((relationshipTypes) => {
                this.relationshipTypes = relationshipTypes;
            }, (err) => {
                alert(JSON.stringify(err, null, 4));
                this._isLoading = false;
            });

            // relationships
            // todo add pagination support
            this.subjectGroupsWithRelationships = [];
            this.relationshipsResponse$ = this.rest.searchRelationshipsByIdentity(this.idValue, 1);
            this.relationshipsResponse$.subscribe((relationshipResources) => {
                this._isLoading = false;
                for (const relationshipResource of relationshipResources.list) {
                    let subjectGroupWithRelationshipsToAddTo: SubjectGroupWithRelationships;
                    const subjectResource = relationshipResource.value.subject;
                    for (const subjectGroupWithRelationships of this.subjectGroupsWithRelationships) {
                        if (subjectGroupWithRelationships.hasSameSubject(subjectResource)) {
                            subjectGroupWithRelationshipsToAddTo = subjectGroupWithRelationships;
                        }
                    }
                    if (!subjectGroupWithRelationshipsToAddTo) {
                        subjectGroupWithRelationshipsToAddTo = new SubjectGroupWithRelationships();
                        subjectGroupWithRelationshipsToAddTo.subjectResource = subjectResource;
                        this.subjectGroupsWithRelationships.push(subjectGroupWithRelationshipsToAddTo);
                    }
                    subjectGroupWithRelationshipsToAddTo.relationshipResources.push(relationshipResource);
                }
            }, (err) => {
                alert(JSON.stringify(err, null, 4));
                this._isLoading = false;
            });

            // pagination delegate
            this.paginationDelegate = {
                goToPage: (page: number) => {
                    // todo navigate to next page
                }
            } as SearchResultPaginationDelegate;

        });

    }

    public ngOnDestroy() {
        this.rteParamSub.unsubscribe();
    }

    public commaSeparatedListOfProviderNames(subject: IParty): string {
        let providerNames: string[] = [];
        if (subject) {
            if (subject && subject.identities && subject.identities.length > 0) {
                for (const identityHrefValue of subject.identities) {
                    providerNames.push(identityHrefValue.value.profile.provider);
                }
            }
        }
        return providerNames.join(',');
    }

    public get isLoading() {
        return this._isLoading;
    }

    public goToRelationshipsAddPage = () => {
        this.router.navigate(['/relationships/add', encodeURIComponent(this.idValue)]);
    };

    public goToRelationshipsAuthorisationPage = () => {
        this.router.navigate(['/relationships/add/enter', encodeURIComponent(this.idValue)]);
    };

    public goToRelationshipsContext(partyResource: IHrefValue<IParty>) {
        const defaultIdentityResource = this.modelHelper.getDefaultIdentityResource(partyResource.value);
        if (defaultIdentityResource) {
            const identityIdValue = defaultIdentityResource.value.idValue;
            this.router.navigate(['/relationships', encodeURIComponent(identityIdValue)]);
        }
    }

}

class SubjectGroupWithRelationships {

    public subjectResource: IHrefValue<IParty>;
    public relationshipResources: IHrefValue<IRelationship>[] = [];

    public hasSameSubject(aSubjectResource: IHrefValue<IParty>) {
        return this.subjectResource.href === aSubjectResource.href;
    }

}