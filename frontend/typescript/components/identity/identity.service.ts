// TODO this component need to be deleted or migrated to project standards
import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Identity} from '../../../../commons/RamAPI';
import {Observable} from 'rxjs/Rx';

@Injectable()
export class IdentityService {

    constructor(private http:Http) {
    }

    public getMe():Observable<Identity> {
        // TODO this should probably work at the party level to get the partyType and default identity
        return this.http.get<Identity>('/api/v1/identity/me')
            .catch(error => Observable.throw(error.json()));
    }

}
