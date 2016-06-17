import {OnInit, Component} from '@angular/core';
import {FORM_DIRECTIVES, DatePipe} from '@angular/common';
import {Router, ROUTER_PROVIDERS, RouteParams} from '@angular/router-deprecated';
import {RAMRestService} from '../../services/ram-rest.service';
import {
    IRelationship,
    IRelationshipType,
    IRelationshipAttributeName,
    IName
} from '../../../../commons/RamAPI2';
import Rx from 'rxjs/Rx';

@Component({
    selector: 'accept-authorisation',
    templateUrl: 'accept-authorisation.component.html',
    directives: [FORM_DIRECTIVES],
    providers: [ROUTER_PROVIDERS]
})
export class AcceptAuthorisationComponent implements OnInit {

    public code: string;
    public idValue: string;

    public relationship$: Rx.Observable<IRelationship>;
    public relationshipType$: Rx.Observable<IRelationshipType>;

    public delegateManageAuthorisationAllowedIndAttribute: IRelationshipAttributeName;

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
            for (let attribute of relationship.attributes) {
                if (attribute.attributeName.value.code === 'DELEGATE_MANAGE_AUTHORISATION_ALLOWED_IND') {
                    this.delegateManageAuthorisationAllowedIndAttribute = attribute;
                }
            }
        }, (err) => {
            if (err.status === 404) {
                this.goToRelationshipsPage();
            } else {
                // todo
                alert(JSON.stringify(err, null, 4));
            }
        });
    }

    public acceptAuthorisation = () => {
        this.rest.acceptPendingRelationshipByInvitationCode(this.code).subscribe(() => {
            this.goToRelationshipsPage();
        }, (err) => {
            // todo
            alert(JSON.stringify(err, null, 4));
        });
    };

    public goToRelationshipsPage = () => {
        this.router.navigate(['Relationships', { identityValue: this.idValue }]);
    };

    /**
     * Todo: Implement displayName as a pipe
     */
    public displayName(name: IName) {
        if (name) {
            return name.unstructuredName ? name.unstructuredName : name.givenName + ' ' + name.familyName;
        }
    }

    // TODO: not sure how to set the locale
    public displayDate(dateString: string) {
        if (dateString) {
            const date = new Date(dateString);
            const datePipe = new DatePipe();
            return datePipe.transform(date, 'd') + ' ' +
                datePipe.transform(date, 'MMMM') + ' ' +
                datePipe.transform(date, 'yyyy');
        }
        return 'Not specified';
    }

}
