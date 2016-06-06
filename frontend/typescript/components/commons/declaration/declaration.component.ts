import { Component } from '@angular/core';
import { ControlGroup, Validators, FormBuilder }
from '@angular/common';

@Component({
    selector: 'declaration',
    templateUrl: 'declaration.component.html'
})
export class DeclarationComponent {
    private form: ControlGroup;

    constructor(fb: FormBuilder) {
        this.form = fb.group({
        });
    }
}
