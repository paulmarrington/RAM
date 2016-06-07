import { Component } from '@angular/core';
import { FORM_DIRECTIVES, FormBuilder } from '@angular/common';
import { RAMComponent }                 from '../../../commons/RAMComponent';
import {IndividualRepresentativeDetailsComponent} from
'./individual-representative-details/individual-representative-details.component';
import {OrganisationRepresentativeDetailsComponent} from
'./organisation-representative-details/organisation-representative-details.component';

@Component({
    selector: 'representative-details',
    templateUrl: 'representative-details.component.html',
    directives: [
        IndividualRepresentativeDetailsComponent,
        OrganisationRepresentativeDetailsComponent,
        FORM_DIRECTIVES
    ]
})

export class RepresentativeDetailsComponent extends RAMComponent<RepresentativeDetailsComponentData> {

    constructor(_fb: FormBuilder) { super(_fb); };

    protected controls() {
        return {
            'authType': [this.data.representativeType]
        };
    }

    // TODO: work-around until Angular-2 understands radio buttons
    //private model:{selectRepresentativeType:String};
    // constructor() {
    //     this.model = {selectRepresentativeType: ''};
    // }
    get isIndividual(): boolean {
        return this.data.representativeType === 'individual';
    }
    get isOrganisation(): boolean {
        return this.data.representativeType === 'organisation';
    }
}

export interface RepresentativeDetailsComponentData {
    representativeType: String;
}
