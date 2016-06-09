import {OnInit, Input, Output, EventEmitter, Component} from '@angular/core';
import {ControlGroup, FormBuilder, FORM_DIRECTIVES, Validators, Control}
from '@angular/common';

@Component({
    selector: 'authorisation-type',
    templateUrl: 'authorisation-type.component.html',
    directives: [FORM_DIRECTIVES]
})

export class AuthorisationTypeComponent implements OnInit {

    public form: ControlGroup;

    @Input('data') public data: AuthorisationTypeComponentData;

    @Output('dataChange') public dataChanges = new EventEmitter<AuthorisationTypeComponentData>();

    @Output('validationErrors') public validationErrors = new EventEmitter<boolean>();

    constructor(private _fb: FormBuilder) { }

    public ngOnInit() {
        this.form = this._fb.group({
            'authType': [this.data.authType,
                Validators.compose([this.isAuthTypeSelected])
            ]
        });
        this.form.valueChanges.subscribe(
            (v: AuthorisationTypeComponentData) => {
                this.dataChanges.emit(v);
            });
    }

    private isAuthTypeSelected = (authType: Control) => {
        return (authType.value === 'choose') ? { authorisationTypeNotSet: { valid: false } } : null;
    };
}

export interface AuthorisationTypeComponentData {
    authType: String;
}
