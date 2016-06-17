import {Component} from '@angular/core';
import {RelationshipsTableComponent} from '../relationships-table/relationships-table.component';
import {RouteParams} from '@angular/router-deprecated';
import {ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import Rx from 'rxjs/Rx';
import {RAMIdentityService} from '../../services/ram-identity.service';
import {
    IName
} from '../../../../commons/RamAPI2';

@Component({
    selector: 'ram-relationships',
    templateUrl: 'relationships.component.html',
    directives: [RelationshipsTableComponent, ROUTER_DIRECTIVES],
})

export class RelationshipsComponent {

    public idValue: string;

    public identityDisplayName$: Rx.Observable<IName>;

    constructor(private routeParams: RouteParams,
        private identityService: RAMIdentityService) {
    }

    public ngOnInit() {
        this.idValue = this.routeParams.get('idValue');
        this.identityDisplayName$ = this.identityService
            .getDefaultName(this.idValue);
    }

}