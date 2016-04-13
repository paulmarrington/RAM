import {Component, OnInit,Output,EventEmitter} from "angular2/core";
import {DelegatesTableComponent} from "../delegates-table/delegates-table.component";
import {SubjectsTableComponent} from "../subjects-table/subjects-table.component";
import {NavCrumbComponent} from "../nav-crumb/nav-crumb.component";
import {RAMRestService} from "../../services/ram-rest.service";
import {NavReq, IRelationshipQuickInfo} from "../../../../commons/RamAPI";

@Component({
    selector: "ram-relationships",
    templateUrl: "relationships.component.html",
    directives: [SubjectsTableComponent, NavCrumbComponent,DelegatesTableComponent]
})
export class RelationshipsComponent implements OnInit {

    @Output() change = new EventEmitter<IRelationshipQuickInfo>();

    constructor(private rest: RAMRestService) { }

    ngOnInit() { }

}