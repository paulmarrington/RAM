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
        return this.http.get('/api/v1/identity/me')
            .map(res => Identity.fromJson(res.json()))
            .catch(error => Observable.throw(error.json()));
    }

}
