import { Component } from '@angular/core';
import { ControlGroup, Validators, Control } from '@angular/common';

@Component({
    selector: 'access-period',
    templateUrl: 'access-period.component.html'
})
export class AccessPeriodComponent {
    private startDateControl = new Control('', Validators.required);
    private endDateControl   = new Control('');
    private NoEndDateControl = new Control('');
    public form = new ControlGroup({
        startDate: this.startDateControl,
        endDate:   this.endDateControl,
        noEndDate: this.NoEndDateControl
    });
    get hasStartDate(): boolean {
        return (this.startDateControl.value.length !== 0);
    }
    get hasEndDate(): boolean {
        return (this.endDateControl.value.length !== 0);
    }
    get hasNoEndDate(): boolean {
        return (this.NoEndDateControl.value.length !== 0);
    }
}
