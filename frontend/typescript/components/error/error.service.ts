// TODO this component need to be deleted or migrated to project standards
import {EventEmitter} from '@angular/core';
import {Error} from './error';
import {ErrorResponse} from '../../../../commons/RamAPI';

export class ErrorService {
    public errorOccurred = new EventEmitter<Error>();

    public handleError(error: ErrorResponse) {
        this.errorOccurred.emit(Error.fromJson(error));
    }
}