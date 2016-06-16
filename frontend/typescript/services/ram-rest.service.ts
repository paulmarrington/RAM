import { Injectable } from '@angular/core';
import {
    IIdentity,
    IRelationship
} from '../../../commons/RamAPI2';
import Rx from 'rxjs/Rx';
import {Response, Http} from '@angular/http';

@Injectable()
export class RAMRestService {

    constructor(private http: Http) {
    }

    // A call external to RAM to get organisation name from ABN
    public getOrganisationNameFromABN(abn: string) {
        // This is temporary until we can talk to the server
        // How about mocking framework?
        return Promise.resolve('The End of Time Pty Limited');
    }

    private extractData(res: Response) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Status code is:' + res.status);
        }
        const body = res.json();
        return body || {};
    }

    public getIdentity(identityValue: string): Rx.Observable<IIdentity> {
        return this.http
            .get(`/api/v1/identity/${identityValue}`)
            .map(this.extractData);
    }
    public acceptPendingRelationshipByInvitationCode(invitationCode: string): Rx.Observable<IRelationship> {
        return this.http
            .get(`/api/v1/relationship/invitationCode/${invitationCode}`)
            .map(this.extractData);
    }

    public viewPendingRelationshipByInvitationCode(invitationCode: string): Rx.Observable<IRelationship> {
        return this.http
            .get(`/api/v1/relationship/invitationCode/${invitationCode}`)
            .map(this.extractData);
    }

}

