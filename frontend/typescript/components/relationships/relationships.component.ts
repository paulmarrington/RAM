import {Component} from '@angular/core';
import {RelationshipsTableComponent} from '../relationships-table/relationships-table.component';
import {NavCrumbComponent} from '../nav-crumb/nav-crumb.component';
import { MODAL_DIRECTIVES } from 'ng2-bs3-modal/ng2-bs3-modal';

@Component({
    selector: 'ram-relationships',
    templateUrl: 'relationships.component.html',
    directives: [RelationshipsTableComponent, NavCrumbComponent, MODAL_DIRECTIVES]
})
export class RelationshipsComponent {
    public showAddRelationship = () => {
        console.log('ADD ONE');
    }
    public showAcceptRelationship = () => {
        console.log('ADD ONE');
    }
}