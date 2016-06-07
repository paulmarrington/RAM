import { Component } from '@angular/core';
import { ControlGroup, Control, Validators }
from '@angular/common';

@Component({
    selector: 'declaration',
    templateUrl: 'declaration.component.html'
})
export class DeclarationComponent {
    private acceptedTCControl = new Control('', Validators.required);
    public declarationForm = new ControlGroup({
        acceptedTC: this.acceptedTCControl
    });
}
