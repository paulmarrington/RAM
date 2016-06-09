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

}
