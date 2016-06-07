import { Component } from '@angular/core';
import { ControlGroup, Validators, Control }
from '@angular/common';

@Component({
    selector: 'individual-representative-details',
    templateUrl: 'individual-representative-details.component.html'
})
export class IndividualRepresentativeDetailsComponent {
    private firstNameControl = new Control('', Validators.required);
    private lastNameControl  = new Control('', Validators.required);
    private dobControl       = new Control('');
    public individualRepresentativeDetailsForm = new ControlGroup({
        firstName: this.firstNameControl,
        lastName:  this.lastNameControl,
        dob:       this.dobControl
    });
}
