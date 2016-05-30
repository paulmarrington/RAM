import { Component } from '@angular/core';
import {IndividualRepresentativeDetailsComponent} from
'./individual-representative-details/individual-representative-details.component';
import {OrganisationRepresentativeDetailsComponent} from
'./organisation-representative-details/organisation-representative-details.component';

@Component({
    selector: 'representative-details',
    templateUrl: 'representative-details.component.html',
    directives: [
        IndividualRepresentativeDetailsComponent,
        OrganisationRepresentativeDetailsComponent
    ]
})
export class RepresentativeDetailsComponent {
}
