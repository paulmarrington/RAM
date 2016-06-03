import {OnInit, Input, Output, EventEmitter, Component} from '@angular/core';
import {Validators, ControlGroup, Control, FormBuilder, FORM_DIRECTIVES} from '@angular/common';

@Component({
    selector: 'access-period',
    templateUrl: 'access-period.component.html',
    directives: [FORM_DIRECTIVES]
})
export class AccessPeriodComponent implements OnInit {

    public form: ControlGroup;

    @Input('data') public data: AccessPeriodComponentData;

    @Output('dataChange') public dataChanges = new EventEmitter<AccessPeriodComponentData>();

    constructor(private fb: FormBuilder) {
    }

    public ngOnInit() {
        this.form = this.fb.group({
            'startDate': [Helper.dateToDDMMYYYY(this.data.startDate),
                Validators.compose([Validators.required, RAMNgValidators.dateFormatValidator])],
            'endDate': [Helper.dateToDDMMYYYY(this.data.endDate),
                Validators.compose([RAMNgValidators.dateFormatValidator])],
            'noEndDate': [this.data.noEndDate]
        }, { validator: Validators.compose([this.isDateBefore('startDate', 'endDate')]) });

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
        });
    }

    private isDateBefore = (startDateCtrlName: string, endDateCtrlName: string) => {
        return (cg: ControlGroup) => {
            let startDate = Helper.parseDate((cg.controls[startDateCtrlName] as Control).value);
            let endDate = Helper.parseDate((cg.controls[endDateCtrlName] as Control).value);
            
            return (startDate !== null && endDate !== null && startDate.getTime() > endDate.getTime()) ? {
                isEndDateBeforeStartDate: {
                    valid: false
                }
            } : null;
        };
    }
}

export class RAMNgValidators {
    public static dateFormatValidator(c: Control) {
        let v = c.value;
        return v !== null && Helper.parseDate(v) === null ? {
            validateDate: {
                valid: false
            }
        } : null;
    }

}

export class Helper {
    public static dateToDDMMYYYY(date: Date) {
        if (date) {
            return date.getDay() + '/' + date.getMonth() + '/' + date.getFullYear();
        }
    }

    public static parseDate(dateString: string): Date {
        if (dateString === null) {
            return null;
        }

        if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString)) {
            return null;
        }

        let parts = dateString.split('/');
        let day = parseInt(parts[0], 10);
        let month = parseInt(parts[1], 10);
        let year = parseInt(parts[2], 10);

        if (year < 1000 || year > 3000 || month == 0 || month > 12) {
            return null;
        }

        let monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) {
            monthLength[1] = 29;
        }

        // Check the range of the day
        if (day > 0 && day <= monthLength[month - 1]) {
            return new Date(year, month, day);
        }
        return null;
    };
}

export interface AccessPeriodComponentData {
    startDate: Date;
    endDate?: Date;
    noEndDate: boolean;
}