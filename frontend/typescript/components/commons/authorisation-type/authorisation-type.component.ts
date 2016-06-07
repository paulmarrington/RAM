import {OnInit, Input, Output, EventEmitter, Component} from '@angular/core';
import {ControlGroup, FormBuilder, FORM_DIRECTIVES} from '@angular/common';

@Component({
    selector:       'authorisation-type',
    templateUrl:    'authorisation-type.component.html',
    directives:     [FORM_DIRECTIVES]
})

export class AuthorisationTypeComponent implements OnInit {

    public form: ControlGroup;

    @Input('data') public data: AuthorisationTypeComponentData;

    @Output('dataChange') public dataChanges = new EventEmitter<AuthorisationTypeComponentData>();

    @Output('validationErrors') public validationErrors = new EventEmitter<boolean>();

    constructor(private _fb: FormBuilder) {}

    public ngOnInit() {
        this.form = this._fb.group({
            'authType': [this.data.authType]
        });
        this.form.valueChanges.subscribe((v: AuthorisationTypeComponentData) => {
            this.dataChanges.emit(v);
            this.validationErrors.emit(this.form.valid);
        });
    }
}

export interface AuthorisationTypeComponentData {
    authType: String;
}
