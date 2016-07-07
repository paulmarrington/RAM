import {OnInit, OnDestroy, Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ROUTER_DIRECTIVES} from '@angular/router';
import Rx from 'rxjs/Rx';
import {PageHeaderComponent} from '../page-header/page-header.component';
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
    directives: [ROUTER_DIRECTIVES, PageHeaderComponent, RelationshipsTableComponent]
})

export class RelationshipsComponent implements OnInit, OnDestroy {

    public idValue: string;

    public identity$: Rx.Observable<IIdentity>;
    public subjectsResponse$: Rx.Observable<ISearchResult<IHrefValue<IParty>[]>>;
    public relationshipsResponse$: Rx.Observable<ISearchResult<IHrefValue<IRelationship>[]>>;

    // todo rename to relationshipTypeHrefs
    public relationshipTypes: IHrefValue<IRelationshipType>[] = [];
    public subjectGroupsWithRelationships: SubjectGroupWithRelationships[];
    public subjectHrefValue: IHrefValue<IParty>;

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
                        subjectGroupWithRelationshipsToAddTo = new SubjectGroupWithRelationships(this.modelHelper);
                        subjectGroupWithRelationshipsToAddTo.subjectResource = subjectResource;
                        this.subjectGroupsWithRelationships.push(subjectGroupWithRelationshipsToAddTo);
                    }
                    subjectGroupWithRelationshipsToAddTo.relationshipResources.push(relationshipResource);
                }
            }, (err) => {
                alert(JSON.stringify(err, null, 4));
                this._isLoading = false;
            });

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

    // todo deprecated
    public getOtherPartyHrefValue = (relationship: IRelationship) => {
        if (this.subjectHrefValue) {
            const relationshipHref = this.modelHelper.linkByType('self', relationship.subject._links).href;
            const subjectHref = this.modelHelper.linkByType('self', this.subjectHrefValue._links).href;
            if (relationshipHref === subjectHref) {
                return relationship.delegate;
            } else {
                return relationship.subject;
            }
        }
        return null;
    };

    public getOtherParty = (relationship: IRelationship) => {
        const party = this.getOtherPartyHrefValue(relationship);
        return party ? party.value : null;
    };

    public backToListing = () => {
        this.subjectHrefValue = null;
    };

    // todo deprecated
    public expandSubject = (subjectHrefValue: IHrefValue<IParty>) => {
        this._isLoading = true;
        this.subjectHrefValue = subjectHrefValue;
        if (subjectHrefValue.value.identities.length > 0) {
            const idValue = subjectHrefValue.value.identities[0].value.idValue;
            this.relationshipsResponse$ = this.rest.searchRelationshipsByIdentity(idValue, 1);
            this.relationshipsResponse$.subscribe(() => {
                this._isLoading = false;
            }, (err) => {
                alert(JSON.stringify(err, null, 4));
                this._isLoading = false;
            });
        }
    };

    // todo deprecated
    // todo not sure what the drill down conditional logic is, for now assume UNIVERSAL
    public isDrillDownPossible = (relationship: IRelationship) => {
        let relationshipType = this.modelHelper.getRelationshipType(this.relationshipTypes, relationship);
        return relationshipType && relationshipType.code === 'UNIVERSAL_REPRESENTATIVE';
    };

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

    constructor(private modelHelper: RAMModelHelper) {
    }

    public hasSameSubject(aSubjectResource: IHrefValue<IParty>) {
        const subjectResourceHref = this.modelHelper.linkByType('self', this.subjectResource._links).href;
        const aSubjectResourceHref = this.modelHelper.linkByType('self', aSubjectResource._links).href;
        return subjectResourceHref === aSubjectResourceHref;
    }

}