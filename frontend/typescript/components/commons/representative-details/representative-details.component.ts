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
    // TODO: work-around until Angular-2 understands check-boxes
    private model:{selectRepresentativeType:String};
    constructor() {
        this.model = {selectRepresentativeType: ''};
    }
    get isIndividual(): boolean {
        return this.model.selectRepresentativeType === 'individual';
    }
    get isOrganisation(): boolean {
        return this.model.selectRepresentativeType === 'organisation';
    }
}
