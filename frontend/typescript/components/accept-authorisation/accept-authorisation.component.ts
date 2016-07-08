import {OnInit, OnDestroy, Component} from '@angular/core';
import {DatePipe} from '@angular/common';
import {Router, ActivatedRoute} from '@angular/router';
import {PageHeaderComponent} from '../page-header/page-header.component';
import {RAMModelHelper} from '../../commons/ram-model-helper';
import {RAMRestService} from '../../services/ram-rest.service';
import {
    IIdentity,
    IRelationship,
    IRelationshipType,
    IRelationshipAttribute,
    IRelationshipAttributeNameUsage
} from '../../../../commons/RamAPI2';
import Rx from 'rxjs/Rx';

@Component({
    selector: 'accept-authorisation',
    templateUrl: 'accept-authorisation.component.html',
    directives: [PageHeaderComponent]
})

export class AcceptAuthorisationComponent implements OnInit, OnDestroy {

    public code: string;
    public idValue: string;

    public identity$: Rx.Observable<IIdentity>;
    public relationship$: Rx.Observable<IRelationship>;
    public relationshipType$: Rx.Observable<IRelationshipType>;

    public relationship: IRelationship;
    public delegateManageAuthorisationAllowedIndAttribute: IRelationshipAttribute;
    public delegateRelationshipTypeDeclarationAttributeUsage: IRelationshipAttributeNameUsage;
    private rteParamSub: Rx.Subscription;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private modelHelper: RAMModelHelper,
                private rest: RAMRestService) {
    }

    /* tslint:disable:max-func-body-length */
    public ngOnInit() {
        this.rteParamSub = this.route.params.subscribe(params => {
            this.code = decodeURIComponent(params['invitationCode']);
            this.idValue = decodeURIComponent(params['idValue']);
            this.identity$ = this.rest.findIdentityByValue(this.idValue);
            this.relationship$ = this.rest.findPendingRelationshipByInvitationCode(this.code);
            this.relationship$.subscribe((relationship) => {
                this.relationship = relationship;
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
        });

    }

    public declineAuthorisation = () => {
        alert('TODO: Decline - Out of Scope');
    };

    public acceptAuthorisation = () => {
        this.rest.acceptPendingRelationshipByInvitationCode(this.relationship).subscribe(() => {
            this.goToRelationshipsPage();
        }, (err) => {
            // todo
            alert(JSON.stringify(err, null, 4));
        });
    };

    public goToEnterAuthorisationPage = () => {
        this.router.navigate(['/relationships/add/enter', encodeURIComponent(this.idValue)]);
    };

    public goToRelationshipsPage = () => {
        this.router.navigate(['/relationships', encodeURIComponent(this.idValue)]);
    };

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

    public ngOnDestroy() {
        this.rteParamSub.unsubscribe();
    }

}