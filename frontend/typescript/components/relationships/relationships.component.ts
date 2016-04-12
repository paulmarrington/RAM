import {Component, OnInit,Output,EventEmitter} from "angular2/core";
import {RelationshipTableComponent} from "../relationship-table/relationship-table.component";
import {NavCrumbComponent} from "../nav-crumb/nav-crumb.component";
import {RAMRestService} from "../../services/ram-rest.service";
import {NavReq, IRelationshipQuickInfo} from "../../../../commons/RamAPI";

@Component({
    selector: "ram-relationships",
    templateUrl: "relationships.component.html",
    directives: [RelationshipTableComponent, NavCrumbComponent]
})
export class RelationshipsComponent implements OnInit {

    @Output() change = new EventEmitter<IRelationshipQuickInfo>();

    constructor(private rest: RAMRestService) { }

    ngOnInit() { }

}