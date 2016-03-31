import { Component, OnInit } from "angular2/core";

import {
    IDataTableResponse,
    EmptyDataTableResponse,
    IKeyValue, Sample,
    RelationshipTableUpdateRequest
}  from "../../../../commons/RamAPI";
import {RAMRestService} from "../../services/ram-rest/ram-rest.service";

@Component({
    selector: "ram-relationship-table",
    templateUrl: "relationship-table.component.html",
    providers: [RAMRestService]
})
export class RelationshipTableComponent implements OnInit {

    parameters: RelationshipTableUpdateRequest = {
        pageSize: 5,
        pageNumber: 1,
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

    relationshipTableResponse = new EmptyDataTableResponse();

    constructor(private rest: RAMRestService) {

    }

    ngOnInit() {
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