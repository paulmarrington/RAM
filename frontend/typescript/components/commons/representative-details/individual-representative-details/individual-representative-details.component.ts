import {OnInit, Input, Output, EventEmitter, Component} from '@angular/core';
import {ControlGroup, FormBuilder, FORM_DIRECTIVES, Validators, Control}
from '@angular/common';
import {Utils} from '../../../../../../commons/ram-utils';
import {RAMNgValidators} from '../../../../commons/ram-ng-validators';

@Component({
    selector:    'individual-representative-details',
    templateUrl: 'individual-representative-details.component.html',
    directives:  [FORM_DIRECTIVES]
})
export class IndividualRepresentativeDetailsComponent implements OnInit {

    public form: ControlGroup;

    @Input('data') public data: IndividualRepresentativeDetailsComponentData;

    @Output('dataChange') public dataChanges = new EventEmitter<IndividualRepresentativeDetailsComponentData>();

    constructor(private _fb: FormBuilder) {}

    public ngOnInit() {
        this.form = this._fb.group({
            'firstName': [this.data.firstName, Validators.required],
            'lastName':  [this.data.lastName, Validators.compose([
            Validators.required, Validators.minLength(2)])],
            'dob':       [Utils.dateToDDMMYYYY(this.data.dob),
                Validators.compose([RAMNgValidators.dateFormatValidator])]
        }, {validator: Validators.compose([this.fullNameFilledIn])});
        this.form.valueChanges.subscribe(
        (v: IndividualRepresentativeDetailsComponentData) => {
            this.dataChanges.emit(v);
        });
    }

    private fullNameFilledIn = (cg: ControlGroup) => {
        const firstName = (cg.controls['firstName'] as Control).value;
        const lastName  = (cg.controls['lastName'] as Control).value;
        if (firstName.length > 0 && lastName.length > 0) {
            return null;
        } else {
            return {isFullNameFilledIn: {valid: false}}
        }
    };
}

export interface IndividualRepresentativeDetailsComponentData {
    firstName: String;
    lastName:  String;
    dob:       Date;
};