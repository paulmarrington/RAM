import {Component, OnInit, Input} from "angular2/core";
import Rx from "rxjs/Rx";
import {ControlGroup, Control, FORM_DIRECTIVES} from "angular2/common";
import {
    IRelationshipTableRes,
    EmptyRelationshipTableRes,
    IKeyValue, IRelationshipTableRow,
    RelationshipTableReq
}  from "../../../../commons/RamAPI";
import {RAMConstantsService} from "../../services/ram-constants.service";
import {RAMNavService} from "../../services/ram-nav.service";
import {RAMRestService} from "../../services/ram-rest.service";

@Component({
    selector: "ram-relationships-table",
    templateUrl: "relationships-table.component.html",
    providers: [FORM_DIRECTIVES]
})
export class RelationshipsTableComponent implements OnInit {

    private _isLoading = new Rx.Subject<boolean>();
    private isLoading$ = this._isLoading.asObservable();
    @Input() delegate: boolean;

    pageNo = 1; // initial value
    pageSize = 5; // default value
    private _relIds = new Array<string>();

    pageSizeOptions:Array<number> = [5,10,25,100]; // default value

    relationshipTableResponse$: Rx.Observable<IRelationshipTableRow[]>;
    statusOptions$: Rx.Observable<string[]>;
    accessLevelOptions$: Rx.Observable<string[]>;
    relationshipOptions$: Rx.Observable<string[]>;

    filters$: ControlGroup;

    constructor(
        private constants: RAMConstantsService,
        private nav: RAMNavService,
        private rest: RAMRestService) {
        this.filters$ = new ControlGroup({
            "name": new Control(""),
            "accessLevel": new Control(""),
            "relationship": new Control(""),
            "status": new Control("")
        });
        this._isLoading.next(false);
        this.filters$.valueChanges.debounceTime(500).subscribe(() => this.refreshContents(this._relIds));
        this.pageSizeOptions = constants.PageSizeOptions;
        this.pageSize = constants.DefaultPageSize;
    }

    ngOnInit() {
        this.nav.navObservable$.subscribe((relIds) => this.refreshContents(relIds));
    }

    setSortByField(field: string) {

    }

    setPageSize(newSize: number) {
        this.pageSize = newSize;
        this.refreshContents(this._relIds);
    }

    refreshContents(relIds: string[]) {
        this._relIds = relIds;
        this._isLoading.next(true);

        let response = this.rest.getRelationshipTableData(
            "SomePartyId", this.delegate, relIds, this.filters$.value, this.pageNo, this.pageSize)
            .do(() => this._isLoading.next(false));

        this.relationshipTableResponse$ = response.map(r => r.data.table);
        this.relationshipOptions$ = response.map(r => r.data.relationshipOptions);
        this.accessLevelOptions$ = response.map(r => r.data.accessLevelOptions);
        this.statusOptions$ = response.map(r => r.data.statusValueOptions);
        return response;
    }

    navigateTo(relId: string[]) {
        this.nav.navigateToRel(relId);
    }
}