import {Component} from '@angular/core';
import {RelationshipsTableComponent} from '../relationships-table/relationships-table.component';
import {NavCrumbComponent} from '../nav-crumb/nav-crumb.component';
import {RAMNavService} from '../../services/ram-nav.service';
import {RouteParams} from '@angular/router-deprecated';

@Component({
    selector: 'ram-relationships',
    templateUrl: 'relationships.component.html',
    directives: [RelationshipsTableComponent, NavCrumbComponent]
})
export class RelationshipsComponent {
    constructor(private routeParams:RouteParams, private nav: RAMNavService) {
        this.nav.navigateToRel([this.routeParams.get('identityValue')]);
    };

    public get currentIdentity() {
        return this.nav.currentIdentityName;
    }
}