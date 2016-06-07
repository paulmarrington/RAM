import {Component} from '@angular/core';
import {AccessPeriodComponent, AccessPeriodComponentData} from
'../commons/access-period/access-period.component';
import {AuthorisationPermissionsComponent} from
'../commons/authorisation-permissions/authorisation-permissions.component';
import {AuthorisationTypeComponent} from
'../commons/authorisation-type/authorisation-type.component';
import {DeclarationComponent} from
'../commons/declaration/declaration.component';
import {RepresentativeDetailsComponent} from
'../commons/representative-details/representative-details.component';

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
    public accessPeriodValidationErrors = {};
    public myVar: AddRelationshipComponentData = {
        accessPeriod: {
            startDate: new Date(),
            noEndDate: true,
            endDate: null
        }
    };

    public dumpObject(v: Object) {
        return JSON.stringify(v);
    }

    public submit() {
        console.dir(this.myVar);
    }
}

export interface AddRelationshipComponentData {
    accessPeriod: AccessPeriodComponentData;
}