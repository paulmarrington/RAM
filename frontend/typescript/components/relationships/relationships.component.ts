import Rx from 'rxjs/Rx';
import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES, ActivatedRoute, Router, Params} from '@angular/router';

import {AbstractPageComponent} from '../abstract-page/abstract-page.component';
import {PageHeaderComponent} from '../page-header/page-header.component';
import {SearchResultPaginationComponent, SearchResultPaginationDelegate}
    from '../search-result-pagination/search-result-pagination.component';
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
    directives: [ROUTER_DIRECTIVES, PageHeaderComponent, SearchResultPaginationComponent]
})

export class RelationshipsComponent extends AbstractPageComponent {

    public idValue: string;
    public page: number;

    public identity$: Rx.Observable<IIdentity>;
    public relationships$: Rx.Observable<ISearchResult<IHrefValue<IRelationship>>>;

    // todo rename to relationshipTypeHrefs
    public relationshipTypes: IHrefValue<IRelationshipType>[] = [];
    public subjectGroupsWithRelationships: SubjectGroupWithRelationships[];

    public paginationDelegate: SearchResultPaginationDelegate;

    private _isLoading = false; // set to true when you want the UI indicate something is getting loaded.

    constructor(route: ActivatedRoute,
                router: Router,
                modelHelper: RAMModelHelper,
                rest: RAMRestService) {
        super(route, router, modelHelper, rest);
    }

    // todo need some way to indicate ALL the loading has finished; not a priority right now
    /* tslint:disable:max-func-body-length */
    public onInit(params: {path: Params, query: Params}) {

        this._isLoading = true;

        // extract path and query parameters
        this.idValue = decodeURIComponent(params.path['idValue']);
        this.page = params.query['page'] ? +params.query['page'] : 1;

        // identity in focus
        this.identity$ = this.rest.findIdentityByValue(this.idValue);

        // relationship types
        this.rest.listRelationshipTypes().subscribe((relationshipTypes) => {
            this.relationshipTypes = relationshipTypes;
        }, (err) => {
            alert(JSON.stringify(err, null, 4));
            this._isLoading = false;
        });

        // relationships
        this.subjectGroupsWithRelationships = [];
        this.relationships$ = this.rest.searchRelationshipsByIdentity(this.idValue, this.page);
        this.relationships$.subscribe((relationshipResources) => {
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
                this.router.navigate(['/relationships',
                    encodeURIComponent(this.idValue)],
                    {queryParams: {page: page}}
                );
            }
        } as SearchResultPaginationDelegate;

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