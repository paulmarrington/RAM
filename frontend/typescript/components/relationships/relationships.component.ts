import {Component} from '@angular/core';
import {RelationshipsTableComponent} from '../relationships-table/relationships-table.component';
import {NavCrumbComponent} from '../nav-crumb/nav-crumb.component';

@Component({
    selector: 'ram-relationships',
    templateUrl: 'relationships.component.html',
    directives: [RelationshipsTableComponent, NavCrumbComponent]
})
export class RelationshipsComponent {
    public showAddRelationship = () => {
        console.log('ADD ONE');
    }
    public showAcceptRelationship = () => {
        console.log('ADD ONE');
    }
}