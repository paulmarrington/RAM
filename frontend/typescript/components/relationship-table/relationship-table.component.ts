import { Component, OnInit, Input} from "angular2/core";

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
    providers: [RAMNavService, RAMRestService]
})
export class RelationshipTableComponent implements OnInit {

    @Input("ramCanActFor") canActFor: boolean;

    parameters: RelationshipTableReq = {
        pageSize: 5,
        pageNumber: 1,
        canActFor: true,
        filters: {
            name: "",
            accessLevel: "",
            relationship: "",
            status: ""
        },
        sortByField: ""
    };

    isLoading = false;
    pageSizeOptions = [5, 10, 25, 100];

    relationshipTableResponse: IRelationshipTableRes = new EmptyRelationshipTableRes();

    constructor(
        private nav: RAMNavService,
        private rest: RAMRestService) {
    }

    ngOnInit() {
        this.parameters.canActFor = this.canActFor;
        this.updateTable();
    }

    updateFilter(field: string, value: string) {
        this.parameters.filters[field] = value;
        console.log(this.parameters);
        this.updateTable();
    }

    setSortByField(field: string) {
        this.parameters.sortByField = field;
        this.updateTable();
    }

    setPageSize(newSize: number) {
        this.parameters.pageSize = newSize;
        this.updateTable();
    }

    updateTable() {
        this.isLoading = true;
        this.rest.getRelationshipData("", this.parameters)
            .then(response => {
                this.relationshipTableResponse = response;
                this.isLoading = false;
            });
    }
    getDiagnostic() {
        return JSON.stringify(this.parameters);
    }
}