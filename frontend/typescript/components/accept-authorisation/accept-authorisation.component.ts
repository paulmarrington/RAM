import {OnInit, Component} from '@angular/core';
import {DatePipe} from '@angular/common';
import {Router, RouteParams} from '@angular/router-deprecated';
import {RAMRestService} from '../../services/ram-rest.service';
import {RAMIdentityService} from '../../services/ram-identity.service';
import {
    IRelationship,
    IRelationshipType,
    IRelationshipAttribute,
    IRelationshipAttributeNameUsage,
    IName
} from '../../../../commons/RamAPI2';
import Rx from 'rxjs/Rx';

@Component({
    selector: 'accept-authorisation',
    templateUrl: 'accept-authorisation.component.html',
    providers: []
})

export class AcceptAuthorisationComponent implements OnInit {

    public code: string;
    public idValue: string;

    public relationship$: Rx.Observable<IRelationship>;
    public relationshipType$: Rx.Observable<IRelationshipType>;

    public delegateManageAuthorisationAllowedIndAttribute: IRelationshipAttribute;
    public delegateRelationshipTypeDeclarationAttributeUsage: IRelationshipAttributeNameUsage;

    constructor(private routeParams: RouteParams,
        private router: Router,
        private identityService: RAMIdentityService,
        private rest: RAMRestService) {
    }

    public ngOnInit() {
        this.code = this.routeParams.get('invitationCode');
        this.idValue = this.routeParams.get('idValue');
        this.relationship$ = this.rest.findPendingRelationshipByInvitationCode(this.code);
        this.relationship$.subscribe((relationship) => {
            for (let attribute of relationship.attributes) {
                if (attribute.attributeName.value.code === 'DELEGATE_MANAGE_AUTHORISATION_ALLOWED_IND') {
                    this.delegateManageAuthorisationAllowedIndAttribute = attribute;
                }
            }
            this.relationshipType$ = this.rest.findRelationshipTypeByHref(relationship.relationshipType.href);
            this.relationshipType$.subscribe((relationshipType) => {
                    for (let attributeUsage of relationshipType.relationshipAttributeNames) {
                        if (attributeUsage.attributeNameDef.value.code === 'DELEGATE_RELATIONSHIP_TYPE_DECLARATION') {
                            this.delegateRelationshipTypeDeclarationAttributeUsage = attributeUsage;
                        }
                    }
                });
        }, (err) => {
            if (err.status === 404) {
                alert('Invalid invitation code');
                this.goToEnterAuthorisationPage();
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

    public goToEnterAuthorisationPage = () => {
        this.router.navigate(['EnterInvitationCodeComponent', { idValue: this.idValue }]);
    };

    public goToRelationshipsPage = () => {
        this.router.navigate(['Relationships', { idValue: this.idValue }]);
    };

    /**
     * Todo: Implement displayName as a pipe
     */
    public displayName(name: IName) {
        if (name) {
            return name.unstructuredName ? name.unstructuredName : name.givenName + ' ' + name.familyName;
        }
    }

    // TODO: not sure how to set the locale, Implement as a pipe
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
