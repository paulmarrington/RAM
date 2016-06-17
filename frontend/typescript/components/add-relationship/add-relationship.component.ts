import {Component} from '@angular/core';
import {AccessPeriodComponent, AccessPeriodComponentData} from '../commons/access-period/access-period.component';
import {AuthorisationPermissionsComponent} from '../commons/authorisation-permissions/authorisation-permissions.component';
import {AuthorisationTypeComponent, AuthorisationTypeComponentData} from '../commons/authorisation-type/authorisation-type.component';
import {DeclarationComponent, DeclarationComponentData} from '../commons/declaration/declaration.component';
import {RepresentativeDetailsComponent, RepresentativeDetailsComponentData} from
'../commons/representative-details/representative-details.component';
import {Router, RouteParams} from '@angular/router-deprecated';
import {RAMIdentityService} from '../../services/ram-identity.service';
import {RAMRestService} from '../../services/ram-rest.service';
import Rx from 'rxjs/Rx';
import {
    IName,
    ICreateIdentityDTO
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

    //@Input('createRelationshipEvent') public createRelationshipEvent = new EventEmitter<boolean>();

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

    constructor(private routeParams:RouteParams,
                private router:Router,
                private rest:RAMRestService) {
    }

    public ngOnInit() {
        this.idValue = this.routeParams.get('idValue');
        // TODO fetch name
        //this.identityDisplayName$ = this.identityService
        //    .getDefaultName(this.idValue);
    }

    public dumpObject(v: Object) {
        // creates formatted JSON - display in <pre> tag
        return JSON.stringify(v, null, 2);
    }

    /* tslint:disable:max-func-body-length */
    public submit = () => {

        let delegate: ICreateIdentityDTO;

        if (this.newRelationship.representativeDetails.individual) {
            const dob = this.newRelationship.representativeDetails.individual.dob;
            delegate = {
                partyType: 'INDIVIDUAL',
                givenName: this.newRelationship.representativeDetails.individual.givenName,
                familyName: this.newRelationship.representativeDetails.individual.familyName,
                sharedSecretTypeCode: 'DATE_OF_BIRTH', // TODO: set to date of birth code
                sharedSecretValue: dob ? dob.toString() : ' ' /* TODO check format of date, currently sending x for space */,
                identityType: 'INVITATION_CODE',
                agencyScheme: undefined,
                agencyToken: undefined,
                linkIdScheme: undefined,
                linkIdConsumer: undefined,
                publicIdentifierScheme: undefined,
                profileProvider: undefined,
            };
        } else {
            /* TODO handle organisation delegate */
            alert('NOT YET IMPLEMENTED!');
            //delegate = {
            //    partyType: 'ABN',
            //    unstructuredName: '' ,
            //    identityType: 'PUBLIC_IDENTIFIER',
            //    publicIdentifierScheme: 'ABN',
            //    agencyToken: this.newRelationship.representativeDetails.organisation.abn // // TODO: where does the ABN value go?
            //};
        }

        const relationship:IRelationshipAddDTO = {
            relationshipType: this.newRelationship.authType.authType,
            subjectIdValue: this.idValue /* TODO subject identity idValue */,
            delegate: delegate,
            startTimestamp: this.newRelationship.accessPeriod.startDate,
            endTimestamp: this.newRelationship.accessPeriod.endDate,
            attributes: [] /* TODO setting the attributes */
        };

        console.log(this.rest);
        this.rest.createRelationship(relationship).subscribe((relationship) => {
            //console.log(JSON.stringify(relationship, null, 4));
            this.rest.getIdentityByHref(relationship.delegate.value.identities[0].href).subscribe((identity) => {
                //console.log(JSON.stringify(identity, null, 4));
                this.router.navigate(['AddRelationshipCompleteComponent', {
                    idValue: this.idValue,
                    invitationCode: identity.rawIdValue
                }]);
            }, (err) => {
                // TODO
                alert(JSON.stringify(err, null, 2));
            });
        }, (err) => {
            // TODO
            alert(JSON.stringify(err, null, 2));
        });

    }
}

export interface AddRelationshipComponentData {
    accessPeriod: AccessPeriodComponentData;
    authType: AuthorisationTypeComponentData;
    representativeDetails: RepresentativeDetailsComponentData;
    decalaration: DeclarationComponentData;
}