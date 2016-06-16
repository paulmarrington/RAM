import {OnInit, Component} from '@angular/core';
import {FORM_DIRECTIVES} from '@angular/common';
import {Router, ROUTER_PROVIDERS, RouteParams} from '@angular/router-deprecated';
import {RAMIdentityService} from '../../services/ram-identity.service';
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
    providers: [ROUTER_PROVIDERS, RAMIdentityService]
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
                console.log('FOUND: ' + attribute.attributeName.value.code);
                if (attribute.attributeName.value.code === 'DELEGATE_MANAGE_AUTHORISATION_ALLOWED_IND') {
                    console.log('MATCHED: ' + attribute.attributeName.value.code);
                    this.delegateManageAuthorisationAllowedIndAttribute = attribute;
                }
            }
        }, (err) => {
            if (err.status === 404) {
                this.gotoRelationshipsPage();
            } else {
                // todo
                alert(JSON.stringify(err, null, 4));
            }
        });
    }

    public acceptAuthorisation = () => {
        this.rest.acceptPendingRelationshipByInvitationCode(this.code).subscribe(() => {
            this.gotoRelationshipsPage();
        }, (err) => {
            // todo
            alert(JSON.stringify(err, null, 4));
        });
    };

    public goToRelationshipsPage = () => {
        this.router.navigate(['Relationships', {identityValue: this.idValue}]);
    };

    /**
     * Todo: Implement displayName as a pipe
     **/
    public displayName(name: IName) {
        if (name) {
            return name.unstructuredName ? name.unstructuredName : name.givenName + ' ' + name.familyName;
        }
    }

}
