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
    public subjectHrefValue: IHrefValue<IParty>;

    private _isLoading = false; // set to true when you want the UI indicate something is getting loaded.

    private rteParamSub: Rx.Subscription;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private modelHelper: RAMModelHelper,
                private rest: RAMRestService) {
    }

    public ngOnInit() {
        this._isLoading = true;
        this.rteParamSub = this.route.params.subscribe(params => {
            this.idValue = decodeURIComponent(params['idValue']);
            this.identity$ = this.rest.findIdentityByValue(this.idValue);
            this.subjectsResponse$ = this.rest.searchDistinctSubjectsBySubjectOrDelegateIdentity(this.idValue, 1);
            this.subjectsResponse$.subscribe((searchResult) => {
                this._isLoading = false;
            }, (err) => {
                alert(JSON.stringify(err, null, 4));
                this._isLoading = false;
            });

            this.rest.listRelationshipTypes().subscribe((relationshipTypes) => {
                this.relationshipTypes = relationshipTypes;
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

    public getOtherPartyHrefValue = (relationship: IRelationship) => {
        if (this.subjectHrefValue) {
            if (this.modelHelper.linkByType('self', relationship.subject._links).href === this.modelHelper.linkByType('self', this.subjectHrefValue._links).href) {
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

}