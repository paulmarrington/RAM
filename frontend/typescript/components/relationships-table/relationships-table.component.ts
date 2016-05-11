import {Component, OnInit, Input} from '@angular/core';
import {RouteParams} from '@angular/router-deprecated';
import Rx from 'rxjs/Rx';
import {ControlGroup, Control, FORM_DIRECTIVES,FORM_PROVIDERS} from '@angular/common';
import {
    IRelationshipTableRow
}  from '../../../../commons/RamAPI';
import {RAMConstantsService} from '../../services/ram-constants.service';
import {RAMNavService} from '../../services/ram-nav.service';
import {RAMRestService} from '../../services/ram-rest.service';

@Component({
    selector: 'ram-relationships-table',
    templateUrl: 'relationships-table.component.html',
    providers: [FORM_PROVIDERS],
    directives: [FORM_DIRECTIVES]
})
export class RelationshipsTableComponent implements OnInit {

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

    constructor(
        private constants: RAMConstantsService,
        private routeParams:RouteParams,
        private nav: RAMNavService,
        private rest: RAMRestService) {
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
        this.nav.navObservable$.subscribe((relIds) => this.refreshContents(relIds));
    }

    public setPageSize(newSize: number) {
        this._pageSize = newSize;
        this.refreshContents(this._relIds);
    }

    private refreshContents(relIds: string[]) {
        this._relIds = relIds;
        this._isLoading = true;
        const identityValue = this.routeParams.get('identityValue');
        const identityResolver = this.routeParams.get('identityResolver');
        const response = this.rest.getRelationshipTableData(identityResolver,
        identityValue, this._delegate, relIds, this._filters$.value,
        this._pageNo, this._pageSize)
            .do(() => {
                this._isLoading = false;
            });

        this._relationshipTableResponse$ = response.map(r => r.table);
        this._relationshipOptions$ = response.map(r => r.relationshipOptions);
        this._accessLevelOptions$ = response.map(r => r.accessLevelOptions);
        this._statusOptions$ = response.map(r => r.statusValueOptions);
        return response;
    }

    public navigateTo(relId: string[]) {
        this.nav.navigateToRel(relId);
    }

    public viewRelationship(relId: string) {
        console.log(`Todo: View relationship: ${relId}`);
    }
}