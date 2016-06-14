import {RAMNgValidators} from '../../commons/ram-ng-validators';
import {OnInit, Component} from '@angular/core';
import {Validators, ControlGroup, FormBuilder, FORM_DIRECTIVES} from '@angular/common';

@Component({
    selector: 'add-relationship-code',
    templateUrl: 'add-relationship-code.component.html',
    directives: [FORM_DIRECTIVES]
})
export class AddRelationshipCodeComponent implements OnInit {

    public form: ControlGroup;

    public data: { email?: String, udn?: String } = { email: 'test1', udn: 'test2' };

    constructor(private _fb: FormBuilder) {
    }

    public ngOnInit() {
        this.form = this._fb.group({
            'email': [this.data.email,
                Validators.compose([RAMNgValidators.validateEmailFormat])],
            'udn': [this.data.udn,
                Validators.compose([RAMNgValidators.validateUDNFormat])]
        });

    }
}
