import { Component } from '@angular/core';
import { ControlGroup, Validators, Control } from '@angular/common';
import {RAMRestService} from '../../../../services/ram-rest.service';

@Component({
    selector: 'organisation-representative-details',
    templateUrl: 'organisation-representative-details.component.html'
})
export class OrganisationRepresentativeDetailsComponent {
    private abnControl = new Control('', Validators.required);
    private organisationControl = new Control('');
    public OrganisationRepresentativeDetailsForm = new ControlGroup({
        abn:          this.abnControl,
        organisation: this.organisationControl
    });

    constructor(private rest:RAMRestService) {}

    // If we have an organisation name, then it was validated
    get hasName(): boolean {
        return (this.organisationControl.value.length !== 0);
    }
    get hasABN(): boolean {
        // abn must be 11 digits with possible spaces between them
        return (/^(\d *?){11}$/.test(this.abnControl.value));
    }

    // operator has pressed "Check ABN" button
    public getOrganisationName() {
        const abn = this.abnControl.value;
        // Rip of to a server to get company name
        this.rest.getOrganisationNameFromABN(abn)
        .then((name:string)=>
            // will cchange display
            this.organisationControl.updateValue(name))
        // TODO: change the error once we have message control on client
        .catch((err:string)=> alert(err));
    }

    public clearOrganisationType() {
        // All we need to do is clear controls to start again
        this.abnControl.updateValue('');
        this.organisationControl.updateValue('');
    }
}
