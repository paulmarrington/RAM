// todo this component is deprecated and should be removed in the near future

import {Component, OnInit, Input, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import Rx from 'rxjs/Rx';
import {ControlGroup, Control, FORM_DIRECTIVES, FORM_PROVIDERS} from '@angular/common';
import {RAMConstantsService} from '../../services/ram-constants.service';
import {RAMNavService} from '../../services/ram-nav.service';
import {RAMRestService2, IRelationshipTableRow} from '../../services/ram-rest2.service';
import {
    IHrefValue,
    IRelationshipType
} from '../../../../commons/RamAPI2';

@Component({
    selector: 'ram-relationships-table',
    templateUrl: 'relationships-table.component.html',
    providers: [FORM_PROVIDERS, RAMRestService2],
    directives: [FORM_DIRECTIVES]
})
export class RelationshipsTableComponent implements OnInit, OnDestroy {

    private _isLoading = false; // set to true when you want the UI indicate something is getting loaded.

    public get isLoading() {
        return this._isLoading;
    }

    @Input() set delegate(value: boolean) {
        this._delegate = value;
    }

    get delegate() {
        return this._delegate;
    }

    private _delegate: boolean;

    private _pageNo = 1; // start from page one [one-based inded]

    private _pageSize: number;

    private _relIds = new Array<string>();

    private _pageSizeOptions: Array<number> = [5, 10, 25, 100]; // default value

    public get pageSizeOptions() {
        return this._pageSizeOptions;
    }

    private _relationshipTableResponse$: Rx.Observable<IRelationshipTableRow[]>;

    public get relationshipTableResponse$() {
        return this._relationshipTableResponse$;
    }

    private _statusOptions$: Rx.Observable<string[]>;

    public get statusOptions$() {
        return this._statusOptions$;
    }

    private _accessLevelOptions$: Rx.Observable<string[]>;

    public get accessLevelOptions$() {
        return this._accessLevelOptions$;
    }
    private _relationshipOptions$: Rx.Observable<string[]>;

    public get relationshipOptions$() {
        return this._relationshipOptions$;
    }

    private _filters$: ControlGroup;

    public get filters$() {
        return this._filters$;
    }

    private rteParamSub: Rx.Subscription;

    @Input() public relationshipTypes: IHrefValue<IRelationshipType>[];

    constructor(private constants: RAMConstantsService,
                private route: ActivatedRoute,
                private router: Router,
                private nav: RAMNavService,
                private rest: RAMRestService2) {
        this._filters$ = new ControlGroup({
            'name': new Control(''),
            'accessLevel': new Control(''),
            'relationship': new Control(''),
            'status': new Control('')
        });
        this._filters$.valueChanges.debounceTime(500).subscribe(() => this.refreshContents(this._relIds));
        this._pageSizeOptions = constants.PageSizeOptions;
        this._pageSize = constants.DefaultPageSize;
    }

    public ngOnInit() {
        this.rteParamSub = this.route.params.subscribe(params => {
            this._relIds = [decodeURIComponent(params['idValue'])];
            this.refreshContents(this._relIds);
        });
    }

    public ngOnDestroy() {
        this.rteParamSub.unsubscribe();
    }

    public setPageSize(newSize: number) {
        this._pageSize = newSize;
        this.refreshContents(this._relIds);
    }

    private refreshContents(relIds: string[]) {
        const identityValue = this._relIds.slice(-1)[0];
        this._isLoading = true;
        const response = this.rest.getRelationshipTableData(
            identityValue,
            this._delegate,
            this._filters$.value,
            this._pageNo,
            this._pageSize)
            .do(() => {
                this._isLoading = false;
            });

        this._relationshipTableResponse$ = response.map(r => r.table);
        this._relationshipOptions$ = response.map(r => r.relationshipOptions);
        this._accessLevelOptions$ = response.map(r => r.accessLevelOptions);
        this._statusOptions$ = response.map(r => r.statusValueOptions);
        return response;
    }

    public relationshipLabel = (code: string): string => {
        if (this.relationshipTypes) {
            for (let relationshipType of this.relationshipTypes) {
                if (relationshipType.value.code === code) {
                    return relationshipType.value.shortDecodeText;
                }
            }
        }
        return code;
    };

    public navigateTo(relId: string) {
        this.router.navigate(['/relationships', encodeURIComponent(relId)]);
    }

    public viewRelationship(relId: string) {
        alert('TODO: View Relationship');
        //console.log(`Todo: View relationship: ${relId}`);
    }
}