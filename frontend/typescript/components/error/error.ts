import {ErrorResponse} from '../../../../commons/RamAPI';

export class Error {

    public static fromJson(json:ErrorResponse) {
        return new Error('Error', json.alert.messages[0]);
    }

    constructor(public title:string, public message:string) {
    }

}