import {OnInit, Component} from '@angular/core';
import {FORM_DIRECTIVES} from '@angular/common';
import {Router, ROUTER_PROVIDERS, RouteParams} from '@angular/router-deprecated';
import {RAMIdentityService} from '../../services/ram-identity.service';
import {RAMRestService} from '../../services/ram-rest.service';
import {
    IRelationship
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

    public relationship: Rx.Observable<IRelationship>;

    constructor(private routeParams: RouteParams,
        private router: Router,
        private identityService: RAMIdentityService,
        private rest: RAMRestService) {
    }

    public ngOnInit() {
        this.code = this.routeParams.get('invitationCode');
        this.idValue = this.routeParams.get('idValue');
        this.relationship = this.rest.viewPendingRelationshipByInvitationCode(this.code);
    }

    public acceptAuthorisation() {
        this.rest.acceptPendingRelationshipByInvitationCode(this.code).subscribe(() => {
            this.router.navigate(['Relationships', { identityValue: this.idValue }]);
        }, (err) => {
            alert(err); // todo
        });
    }
}
