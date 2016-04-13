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
    selector: "ram-subjects-relationship-table",
    templateUrl: "subjects-table.component.html",
    providers: [FORM_DIRECTIVES]
})
export class SubjectsTableComponent implements OnInit {

    pageNo = 1;
    pageSize = 5;
    private _relIds = new Array<string>();

    pageSizeOptions = [5, 10, 25, 100];
    isLoading = false;

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
        this.filters$.valueChanges.debounceTime(500).subscribe(() => this.refreshContents(this._relIds));
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
        this.isLoading = true;

        let response = this.rest.getSubjectTableData(
            "SomePartyId", relIds, this.filters$.value, this.pageNo, this.pageSize)
            .do(() => this.isLoading = false);

        this.relationshipTableResponse$ = response.map(r => r.data.table);
        this.relationshipOptions$ = response.map(r => r.data.relationshipOptions);
        this.accessLevelOptions$ = response.map(r => r.data.accessLevelOptions);
        this.statusOptions$ = response.map(r => r.data.statusValueOptions);
        return response;
    }

    navigateTo(relId: string[]) {
        this.nav.navigateToRel(relId);
    }

    view(relId: string) {

    }
}