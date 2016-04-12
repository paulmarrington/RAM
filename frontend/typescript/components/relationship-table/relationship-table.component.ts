import { Component, OnInit, Input} from "angular2/core";
import Rx from "rxjs/Rx";
import { ControlGroup, Control, FORM_DIRECTIVES} from "angular2/common";

import {
    IRelationshipTableRes,
    EmptyRelationshipTableRes,
    IKeyValue, IRelationshipTableRow,
    RelationshipTableReq
}  from "../../../../commons/RamAPI";
import {RAMNavService} from "../../services/ram-nav.service";
import {RAMRestService} from "../../services/ram-rest.service";

@Component({
    selector: "ram-relationship-table",
    templateUrl: "relationship-table.component.html",
    providers: [FORM_DIRECTIVES]
})
export class RelationshipTableComponent implements OnInit {

    @Input("ram-can-act-for") canActFor: boolean;

    private _isLoading = new Rx.Subject<boolean>();
    private isLoading$ = this._isLoading.asObservable();

    pageNo = 1;
    pageSize = 5;

    pageSizeOptions = [5, 10, 25, 100];

    relationshipTableResponse$: Rx.Observable<IRelationshipTableRow[]>;
    statusOptions$: Rx.Observable<string[]>;
    accessLevelOptions$: Rx.Observable<string[]>;
    relationshipOptions$: Rx.Observable<string[]>;

    filters$: ControlGroup;

    constructor(
        private nav: RAMNavService,
        private rest: RAMRestService) {
        this.filters$ = new ControlGroup({
            "name": new Control(""),
            "accessLevel": new Control(""),
            "relationship": new Control(""),
            "status": new Control("")
        });
        this._isLoading.next(false);
        this.filters$.valueChanges.debounceTime(500).subscribe(() => this.refreshContents());
    }

    ngOnInit() {
        this.nav.navObservable$.subscribe(() => this.refreshContents());
        this.refreshContents();
    }

    setSortByField(field: string) {

    }

    setPageSize(newSize: number) {
        this.pageSize = newSize;
        this.refreshContents();
    }

    refreshContents() {
        this._isLoading.next(true);

        let response = this.rest.getRelationshipData(
            "SomePartyId", this.canActFor, this.filters$.value, this.pageNo, this.pageSize)
            .do(() => this._isLoading.next(false));

        this.relationshipTableResponse$ = response.map(r => r.data);
        this.relationshipOptions$ = response.map(r => r.relationshipOptions);
        this.accessLevelOptions$ = response.map(r => r.accessLevelOptions);
        this.statusOptions$ = response.map(r => r.statusValueOptions);
        return response;
    }

    navigateTo(relId: string) {
        this.nav.navigateToRel(relId);
    }
}