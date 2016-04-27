import {Component} from 'angular2/core';
import {RelationshipsTableComponent} from '../relationships-table/relationships-table.component';
import {NavCrumbComponent} from '../nav-crumb/nav-crumb.component';
import {RAMRestService} from '../../services/ram-rest.service';

@Component({
    selector: 'ram-relationships',
    templateUrl: 'relationships.component.html',
    directives: [RelationshipsTableComponent, NavCrumbComponent]
})
export class RelationshipsComponent {
    constructor(private rest: RAMRestService) { }
}