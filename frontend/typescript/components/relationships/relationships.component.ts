import {Component, Output, EventEmitter} from 'angular2/core';
import {RelationshipsTableComponent} from '../relationships-table/relationships-table.component';
import {NavCrumbComponent} from '../nav-crumb/nav-crumb.component';
import {RAMRestService} from '../../services/ram-rest.service';
import {IRelationshipQuickInfo} from '../../../../commons/RamAPI';

@Component({
    selector: 'ram-relationships',
    templateUrl: 'relationships.component.html',
    directives: [RelationshipsTableComponent, NavCrumbComponent]
})
export class RelationshipsComponent {

    @Output() public change = new EventEmitter<IRelationshipQuickInfo>();

    constructor(private rest: RAMRestService) { }

}