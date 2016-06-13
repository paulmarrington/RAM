import {Control} from '@angular/common';
import {Utils} from '../../../commons/ram-utils';

export class RAMNgValidators {
    public static dateFormatValidator(c: Control) {
        let v = c.value;
        return v !== null && Utils.parseDate(v) === null ? {
            validateDate: {
                valid: false
            }
        } : null;
    }
    public static validateABNFormat = (abn: Control) => {
        if (/^(\d *?){11}$/.test(abn.value)) {
            return null;
        } else {
            return { hasValidABN: { valid: false } };
        }
    }

    public static validateUDNFormat = (abn: Control) => {
        if (/^(\d *?)$/.test(abn.value)) {
            return null;
        } else {
            return { hasValidUDN: { valid: false } };
        }
    }

    public static validateEmail = (abn: Control) => {
        const EMAIL_REGEXP = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
        if (EMAIL_REGEXP.test(abn.value)) {
            return null;
        } else {
            return { hasValidEmail: { valid: false } };
        }
    }

    public static mustBeTrue = (ctrl: Control) => {
        if (ctrl.value) {
            return null;
        } else {
            return { mustBeTrue: { valid: false } };
        }
    }

}
