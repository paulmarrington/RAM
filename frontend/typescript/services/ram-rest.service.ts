import { Injectable } from '@angular/core';
import {
    IIdentity,
    IRelationshipAddDTO,
    IRelationship,
    IRelationshipType
} from '../../../commons/RamAPI2';
import Rx from 'rxjs/Rx';
import {Response, Http, Headers} from '@angular/http';

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

    public getIdentity(href: string): Rx.Observable<IIdentity> {
        return this.http
            .get(href)
            .map(this.extractData);
    }

    public viewRelationshipTypeByCode(code: string): Rx.Observable<IRelationshipType> {
        return this.http
            .get(`/api/v1/relationshipType/${code}`)
            .map(this.extractData);
    }

    public viewRelationshipTypeByHref(href: string): Rx.Observable<IRelationshipType> {
        return this.http
            .get(href)
            .map(this.extractData);
    }

    public viewPendingRelationshipByInvitationCode(invitationCode: string): Rx.Observable<IRelationship> {
        return this.http
            .get(`/api/v1/relationship/invitationCode/${invitationCode}`)
            .map(this.extractData);
    }

    public acceptPendingRelationshipByInvitationCode(invitationCode: string): Rx.Observable<IRelationship> {
        return this.http
            .post(`/api/v1/relationship/invitationCode/${invitationCode}/accept`, '')
            .map(this.extractData);
    }

    public createRelationship(relationship: IRelationshipAddDTO): Rx.Observable<IRelationship> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http
            .post(`/api/v1/relationship`, JSON.stringify(relationship), {
                headers: headers
            })
            .map(this.extractData);
    }
}

