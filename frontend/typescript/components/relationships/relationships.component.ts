import { Component, OnInit } from "angular2/core";
import {RelationshipTableComponent} from "../relationship-table/relationship-table.component";

@Component({
    selector: "ram-relationships",
    templateUrl: "relationships.component.html",
    directives:[RelationshipTableComponent]
})
export class RelationshipsComponent implements OnInit {
    constructor() { }

    ngOnInit() { }

}