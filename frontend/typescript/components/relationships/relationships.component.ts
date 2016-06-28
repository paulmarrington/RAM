import {OnInit, OnDestroy, Component} from '@angular/core';
import {RelationshipsTableComponent} from '../relationships-table/relationships-table.component';
import {ActivatedRoute} from '@angular/router';
import {ROUTER_DIRECTIVES} from '@angular/router';
import Rx from 'rxjs/Rx';
import {RAMRestService} from '../../services/ram-rest.service';
import {RAMIdentityService} from '../../services/ram-identity.service';
import {
    IName,
    IRelationshipType, IHrefValue
} from '../../../../commons/RamAPI2';

@Component({
    selector: 'ram-relationships',
    templateUrl: 'relationships.component.html',
    directives: [RelationshipsTableComponent, ROUTER_DIRECTIVES],
})

export class RelationshipsComponent implements OnInit, OnDestroy {

    public idValue: string;

    public identityDisplayName$: Rx.Observable<IName>;

    public relationshipTypes: IHrefValue<IRelationshipType>[] = [];

    private rteParamSub: Rx.Subscription;

    constructor(private route: ActivatedRoute,
        private identityService: RAMIdentityService,
        private rest: RAMRestService) {
    }

    public ngOnInit() {
        this.rteParamSub = this.route.params.subscribe(params => {
            this.idValue = params['idValue'];
            this.identityDisplayName$ = this.identityService
                .getDefaultName(this.idValue).map(this.displayName);
            this.rest.listRelationshipTypes().subscribe((relationshipTypes) => {
                this.relationshipTypes = relationshipTypes;
            });
        });

    }
    public ngOnDestroy() {
        this.rteParamSub.unsubscribe();
    }

    public displayName(name: IName): string {
        if (name) {
            return name.unstructuredName ? name.unstructuredName : name.givenName + ' ' + name.familyName;
        }
    }

}