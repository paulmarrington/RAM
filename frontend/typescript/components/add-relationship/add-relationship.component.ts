import {Component} from '@angular/core';
import {AccessPeriodComponent, AccessPeriodComponentData} from '../commons/access-period/access-period.component';
import {AuthorisationPermissionsComponent} from '../commons/authorisation-permissions/authorisation-permissions.component';
import {AuthorisationTypeComponent, AuthorisationTypeComponentData} from '../commons/authorisation-type/authorisation-type.component';
import {DeclarationComponent, DeclarationComponentData} from '../commons/declaration/declaration.component';
import {RepresentativeDetailsComponent, RepresentativeDetailsComponentData} from
'../commons/representative-details/representative-details.component';
import {RouteParams} from '@angular/router-deprecated';
import {RAMIdentityService} from '../../services/ram-identity.service';
import Rx from 'rxjs/Rx';
import {
    IName
} from '../../../../commons/RamAPI2';

@Component({
    selector: 'add-relationship',
    templateUrl: 'add-relationship.component.html',
    directives: [
        AccessPeriodComponent,
        AuthorisationPermissionsComponent,
        AuthorisationTypeComponent,
        DeclarationComponent,
        RepresentativeDetailsComponent
    ]
})
export class AddRelationshipComponent {
    public idValue: string;

    public identityDisplayName$: Rx.Observable<IName>;

    public accessPeriodValidationErrors = {};

    public newRelationship: AddRelationshipComponentData = {
        accessPeriod: {
            startDate: null,
            noEndDate: true,
            endDate: null
        },
        authType: {
            authType: 'choose'
        },
        representativeDetails: {
            individual: {
                givenName: '',
                familyName: null,
                dob: null
            },
            organisation: {
                abn: ''
            }
        },
        decalaration: {
            accepted: false
        }
    };

    constructor(private routeParams: RouteParams,
        private identityService: RAMIdentityService) {
    }

    public ngOnInit() {
        this.idValue = this.routeParams.get('idValue');
        this.identityDisplayName$ = this.identityService
            .getDefaultName(this.idValue);
    }

    public dumpObject(v: Object) {
        // creates formatted JSON - display in <pre> tag
        return JSON.stringify(v, null, 2);
    }

    public submit() {
        console.dir(this.newRelationship);
    }
}

export interface AddRelationshipComponentData {
    accessPeriod: AccessPeriodComponentData;
    authType: AuthorisationTypeComponentData;
    representativeDetails: RepresentativeDetailsComponentData;
    decalaration: DeclarationComponentData;
}