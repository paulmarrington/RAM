import {Component} from '@angular/core';

@Component({
    selector: 'complete-authorisation',
    templateUrl: 'complete-authorisation.component.html'
})

export class CompleteAuthorisationComponent {
    public email: String;
    public udn:   String;
    public data: CompleteAuthorisationComponentData = {
        givenName:  'Fred',
        familyName: 'Flinstone',
        authorisationCode: '983601'
    };

    public sendEmail() {
        console.log('Send email to:', this.email);
    }

    public submitUDN() {
        console.log('Submit UDN to:', this.udn);
    }
}

export interface CompleteAuthorisationComponentData {
    givenName:          String;
    familyName:         String;
    authorisationCode:  String;
}