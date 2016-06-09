import {OnInit, Input, Output, EventEmitter, Component} from '@angular/core';
import {ControlGroup, FormBuilder, FORM_DIRECTIVES, Validators}
from '@angular/common';
import {Utils} from '../../../../../../commons/ram-utils';
import {RAMNgValidators} from '../../../../commons/ram-ng-validators';

@Component({
    selector: 'individual-representative-details',
    templateUrl: 'individual-representative-details.component.html',
    directives: [FORM_DIRECTIVES]
})
export class IndividualRepresentativeDetailsComponent implements OnInit {

    public form: ControlGroup;

    @Input('data') public data: IndividualRepresentativeDetailsComponentData;

    @Output('dataChange') public dataChanges = new EventEmitter<IndividualRepresentativeDetailsComponentData>();

    constructor(private _fb: FormBuilder) { }

    public ngOnInit() {
        this.form = this._fb.group({
            'givenName': [this.data.givenName, Validators.required],
            'familyName': [this.data.familyName],
            'dob': [this.data.dob, Validators.compose([RAMNgValidators.dateFormatValidator])]
        });
        this.form.valueChanges.subscribe(
            (v: IndividualRepresentativeDetailsComponentData) => {
                this.dataChanges.emit(v);
            });
    }
}

export interface IndividualRepresentativeDetailsComponentData {
    givenName: String;
    familyName?: String;
    dob?: Date;
}