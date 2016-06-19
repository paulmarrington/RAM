import {Component} from '@angular/core';
import {RelationshipsTableComponent} from '../relationships-table/relationships-table.component';
import {RouteParams} from '@angular/router-deprecated';
import {ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import Rx from 'rxjs/Rx';
import {RAMRestService} from '../../services/ram-rest.service';
import {RAMIdentityService} from '../../services/ram-identity.service';
import {
    IName,
    IRelationshipType
} from '../../../../commons/RamAPI2';

@Component({
    selector: 'ram-relationships',
    templateUrl: 'relationships.component.html',
    directives: [RelationshipsTableComponent, ROUTER_DIRECTIVES],
})

export class RelationshipsComponent {

    public idValue: string;

    public identityDisplayName$: Rx.Observable<IName>;
    public relationshipTypes$: Rx.Observable<IRelationshipType[]>;

    public relationshipTypes: IRelationshipType[] = [];

    constructor(private routeParams: RouteParams,
                private identityService: RAMIdentityService,
                private rest: RAMRestService) {
    }

    public ngOnInit() {
        this.idValue = this.routeParams.get('idValue');
        this.identityDisplayName$ = this.identityService
            .getDefaultName(this.idValue).map(this.displayName);
        this.relationshipTypes$ = this.rest.listRelationshipTypes();
        this.relationshipTypes$.subscribe((relationshipTypes) => {
            this.relationshipTypes = relationshipTypes;
        });
    }

    public displayName(name: IName): string {
        if (name) {
            return name.unstructuredName ? name.unstructuredName : name.givenName + ' ' + name.familyName;
        }
    }

}