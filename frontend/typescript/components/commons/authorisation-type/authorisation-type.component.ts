import { Component }                    from '@angular/core';
import { FORM_DIRECTIVES, FormBuilder } from '@angular/common';
import { RAMComponent }                 from '../../../commons/RAMComponent';

@Component({
    selector:       'authorisation-type',
    templateUrl:    'authorisation-type.component.html',
    directives:     [FORM_DIRECTIVES]
})

export class AuthorisationTypeComponent extends RAMComponent<AuthorisationTypeComponentData> {

    constructor(_fb: FormBuilder) { super(_fb); };

    protected controls() {
        return {
            'authType': [this.data.authType]
        };
    }
}

export interface AuthorisationTypeComponentData {
    authType: String;
}
