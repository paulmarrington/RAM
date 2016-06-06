import { Component } from '@angular/core';
import { ControlGroup, Control }
from '@angular/common';

@Component({
    selector: 'authorisation-type',
    templateUrl: 'authorisation-type.component.html'
})
export class AuthorisationTypeComponent {
    private authTypeControl = new Control('Universal representative');

    public form = new ControlGroup({
        authType: this.authTypeControl
    });
    // Triggers if user changes selection for DDL
    public onChange(authType:string) {
        // TODO: once forms are connected...
        alert(authType);
    }
}
