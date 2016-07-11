import Rx from 'rxjs/Rx';
import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES, ActivatedRoute, Router, Params} from '@angular/router';

import {AbstractPageComponent} from '../abstract-page/abstract-page.component';
import {PageHeaderComponent} from '../commons/page-header/page-header.component';
import {SearchResultPaginationComponent, SearchResultPaginationDelegate}
    from '../commons/search-result-pagination/search-result-pagination.component';
import {RAMRestService} from '../../services/ram-rest.service';
import {RAMModelHelper} from '../../commons/ram-model-helper';
import {RAMRouteHelper} from '../../commons/ram-route-helper';

import {
    ISearchResult,
    IParty,
    IIdentity,
    IRelationship,
    IRelationshipType,
    IHrefValue
} from '../../../../commons/RamAPI2';

@Component({
    selector: 'list-relationships',
    templateUrl: 'relationships.component.html',
    directives: [ROUTER_DIRECTIVES, PageHeaderComponent, SearchResultPaginationComponent]
})

export class RelationshipsComponent extends AbstractPageComponent {

    public idValue: string;
    public page: number;

    public identity$: Rx.Observable<IIdentity>;
    public relationships$: Rx.Observable<ISearchResult<IHrefValue<IRelationship>>>;
    public relationshipTypes$: Rx.Observable<IHrefValue<IRelationshipType>[]>;

    public subjectGroupsWithRelationships: SubjectGroupWithRelationships[];

    public paginationDelegate: SearchResultPaginationDelegate;

    private _isLoading = false; // set to true when you want the UI indicate something is getting loaded.

    constructor(route: ActivatedRoute,
                router: Router,
                rest: RAMRestService,
                modelHelper: RAMModelHelper,
                routeHelper: RAMRouteHelper) {
        super(route, router, rest, modelHelper, routeHelper);
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
        this.relationshipTypes$ = this.rest.listRelationshipTypes();

        // relationships
        this.subjectGroupsWithRelationships = [];
        this.relationships$ = this.rest.searchRelationshipsByIdentity(this.idValue, this.page);
        this.relationships$.subscribe((relationshipRefs) => {
            this._isLoading = false;
            for (const relationshipRef of relationshipRefs.list) {
                let subjectGroupWithRelationshipsToAddTo: SubjectGroupWithRelationships;
                const subjectRef = relationshipRef.value.subject;
                for (const subjectGroupWithRelationships of this.subjectGroupsWithRelationships) {
                    if (subjectGroupWithRelationships.hasSameSubject(subjectRef)) {
                        subjectGroupWithRelationshipsToAddTo = subjectGroupWithRelationships;
                    }
                }
                if (!subjectGroupWithRelationshipsToAddTo) {
                    subjectGroupWithRelationshipsToAddTo = new SubjectGroupWithRelationships();
                    subjectGroupWithRelationshipsToAddTo.subjectRef = subjectRef;
                    this.subjectGroupsWithRelationships.push(subjectGroupWithRelationshipsToAddTo);
                }
                subjectGroupWithRelationshipsToAddTo.relationshipRefs.push(relationshipRef);
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

    public search() {
        // todo search
        alert('TODO: Not yet implemented');
    }

    public goToRelationshipAddPage() {
        this.routeHelper.goToRelationshipAddPage(this.idValue);
    };

    public goToRelationshipEnterCodePage() {
        this.routeHelper.goToRelationshipEnterCodePage(this.idValue);
    };

    public goToRelationshipsContext(partyResource: IHrefValue<IParty>) {
        const defaultIdentityResource = this.modelHelper.getDefaultIdentityResource(partyResource.value);
        if (defaultIdentityResource) {
            const identityIdValue = defaultIdentityResource.value.idValue;
            this.routeHelper.goToRelationshipsPage(identityIdValue);
        }
    }

}

class SubjectGroupWithRelationships {

    public subjectRef: IHrefValue<IParty>;
    public relationshipRefs: IHrefValue<IRelationship>[] = [];

    public hasSameSubject(aSubjectRef: IHrefValue<IParty>) {
        return this.subjectRef.href === aSubjectRef.href;
    }

}