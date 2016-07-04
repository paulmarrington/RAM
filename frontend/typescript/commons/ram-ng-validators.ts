import {Control} from '@angular/common';
import {Utils} from '../../../commons/ram-utils';

export class RAMNgValidators {

    public static dateFormatValidator(dateCtrl: Control) {
        let v = dateCtrl.value;
        return v !== null && Utils.parseDate(v) === null ? {
            validateDate: {
                valid: false
            }
        } : null;
    }

    public static validateABNFormat = (abnCtrl: Control) => {
        if (/^(\d *?){11}$/.test(abnCtrl.value)) {
            return null;
        } else {
            return {hasValidABN: {valid: false}};
        }
    };

    public static validateUDNFormat = (udnCtrl: Control) => {
        if (/^(\d *?)$/.test(udnCtrl.value)) {
            return null;
        } else {
            return {hasValidUDN: {valid: false}};
        }
    };

    public static validateEmailFormat = (emailCtrl: Control) => {
        const EMAIL_REGEXP = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/i;
        if (EMAIL_REGEXP.test(emailCtrl.value)) {
            return null;
        } else {
            return {hasValidEmail: {valid: false}};
        }
    };

    public static mustBeTrue = (ctrl: Control) => {
        if (ctrl.value) {
            return null;
        } else {
            return {mustBeTrue: {valid: false}};
        }
    }

}
