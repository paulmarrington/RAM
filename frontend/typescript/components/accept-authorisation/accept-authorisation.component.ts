import {OnInit, Component} from '@angular/core';
import {FORM_DIRECTIVES} from '@angular/common';
import {Router, ROUTER_PROVIDERS, RouteParams} from '@angular/router-deprecated';
import {RAMIdentityService} from '../../services/ram-identity.service';
import {RAMRestService} from '../../services/ram-rest.service';
import {
    IRelationship,
    IRelationshipType,
    IName
} from '../../../../commons/RamAPI2';
import Rx from 'rxjs/Rx';

@Component({
    selector: 'accept-authorisation',
    templateUrl: 'accept-authorisation.component.html',
    directives: [FORM_DIRECTIVES],
    providers: [ROUTER_PROVIDERS, RAMIdentityService]
})
export class AcceptAuthorisationComponent implements OnInit {

    public code: string;

    public idValue: string;

    public relationship$: Rx.Observable<IRelationship>;
    public relationshipType$: Rx.Observable<IRelationshipType>;

    constructor(private routeParams: RouteParams,
        private router: Router,
        private identityService: RAMIdentityService,
        private rest: RAMRestService) {
    }

    public ngOnInit() {
        this.code = this.routeParams.get('invitationCode');
        this.idValue = this.routeParams.get('idValue');
        this.relationship$ = this.rest.viewPendingRelationshipByInvitationCode(this.code);
        this.relationship$.subscribe((relationship) => {
            this.relationshipType$ = this.rest.viewRelationshipTypeByHref(relationship.relationshipType.href);
        }, (err) => {
            // todo
            alert(err);
        });
    }

    public acceptAuthorisation() {
        this.rest.acceptPendingRelationshipByInvitationCode(this.code).subscribe(() => {
            this.gotoRelationshipsPage();
        }, (err) => {
            // todo
            alert(JSON.stringify(err, null, 4));
        });
    };

    public gotoRelationshipsPage() {
        this.router.navigate(['Relationships', { identityValue: this.idValue }]);
    }

    /**
     * Todo: Implement displayName as a pipe
     **/
    public displayName(name: IName) {
        if (name) {
            return name.unstructuredName ? name.unstructuredName : name.givenName + ' ' + name.familyName;
        }
    }

}
