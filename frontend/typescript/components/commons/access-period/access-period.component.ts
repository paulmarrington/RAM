import {OnInit, Input, Output, EventEmitter, Component} from '@angular/core';
import {Validators, ControlGroup, Control, FormBuilder, FORM_DIRECTIVES} from '@angular/common';
import {Utils} from '../../../../../commons/ram-utils';
import {RAMNgValidators} from '../../../commons/ram-ng-validators';

@Component({
    selector: 'access-period',
    templateUrl: 'access-period.component.html',
    directives: [FORM_DIRECTIVES]
})
export class AccessPeriodComponent implements OnInit {

    public form: ControlGroup;

    @Input('data') public data: AccessPeriodComponentData;

    @Output('dataChange') public dataChanges = new EventEmitter<AccessPeriodComponentData>();

    @Output('validationErrors') public validationErrors = new EventEmitter<boolean>();

    constructor(private _fb: FormBuilder) {
    }

    public ngOnInit() {
        this.form = this._fb.group({
            'startDate': [this.data.startDate,
                Validators.compose([Validators.required, RAMNgValidators.dateFormatValidator])],
            'endDate': [this.data.endDate,
                Validators.compose([RAMNgValidators.dateFormatValidator])],
            'noEndDate': [this.data.noEndDate]
        }, { validator: Validators.compose([this._isDateBefore('startDate', 'endDate')]) });

        let endDate = this.form.controls['endDate'] as Control;
        let noEndDate = this.form.controls['noEndDate'];
        noEndDate.valueChanges.subscribe((v: Boolean) => {
            if (v === true) {
                // reset endDate if noEndDate checkbox is selected
                endDate.updateValue(null);
            }
        });
        this.form.valueChanges.subscribe((v: AccessPeriodComponentData) => {
            this.dataChanges.emit(v);
            this.validationErrors.emit(this.form.valid);
        });
    }

    private _isDateBefore = (startDateCtrlName: string, endDateCtrlName: string) => {
        return (cg: ControlGroup) => {
            let startDate = Utils.parseDate((cg.controls[startDateCtrlName] as Control).value);
            let endDate = Utils.parseDate((cg.controls[endDateCtrlName] as Control).value);

            return (startDate !== null && endDate !== null && startDate.getTime() > endDate.getTime()) ? {
                isEndDateBeforeStartDate: {
                    valid: false
                }
            } : null;
        };
    }
}

export interface AccessPeriodComponentData {
    startDate: Date;
    endDate?: Date;
    noEndDate: boolean;
}
