import { Component } from '@angular/core';
import { ControlGroup, Validators, FormBuilder }
from '@angular/common';

@Component({
    selector: 'individual-representative-details',
    templateUrl: 'individual-representative-details.component.html'
})
export class IndividualRepresentativeDetailsComponent {
    private form: ControlGroup;

    // TODO: move from FormBuilder as won't ts-lint validate
    constructor(fb: FormBuilder) {
        this.form = fb.group({
            firstName: ['', Validators.required],
            lastName:  ['', Validators.required],
            dob:       ['']
        });
    }
}
