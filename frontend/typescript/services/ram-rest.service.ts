import { Injectable } from '@angular/core';
import {
    IIdentity,
    IRelationshipAddDTO,
    IRelationship,
    IRelationshipType, INotifyDelegateDTO
} from '../../../commons/RamAPI2';
import Rx from 'rxjs/Rx';
import {Response, Http, Headers} from '@angular/http';
import {HrefValue} from '../../../commons/RamAPI';

@Injectable()
export class RAMRestService {

    constructor(private http: Http) {
    }

    // TODO remove temporary api
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

    public findIdentityByValue(identityValue: string): Rx.Observable<IIdentity> {
        return this.http
            .get(`/api/v1/identity/${identityValue}`)
            .map(this.extractData);
    }

    public findIdentityByHref(href: string): Rx.Observable<IIdentity> {
        return this.http
            .get(href)
            .map(this.extractData);
    }

    public findRelationshipTypeByCode(code: string): Rx.Observable<IRelationshipType> {
        return this.http
            .get(`/api/v1/relationshipType/${code}`)
            .map(this.extractData);
    }

    public listRelationshipTypes(): Rx.Observable<HrefValue<IRelationshipType>[]> {
        return this.http
            .get('/api/v1/relationshipTypes')
            .map(this.extractData);
    }

    public findRelationshipTypeByHref(href: string): Rx.Observable<IRelationshipType> {
        return this.http
            .get(href)
            .map(this.extractData);
    }

    public findPendingRelationshipByInvitationCode(invitationCode: string): Rx.Observable<IRelationship> {
        return this.http
            .get(`/api/v1/relationship/invitationCode/${invitationCode}`)
            .map(this.extractData);
    }

    public acceptPendingRelationshipByInvitationCode(invitationCode: string): Rx.Observable<IRelationship> {
        return this.http
            .post(`/api/v1/relationship/invitationCode/${invitationCode}/accept`, '')
            .map(this.extractData);
    }

    public notifyDelegateByInvitationCode(invitationCode: string, notification:INotifyDelegateDTO): Rx.Observable<IRelationship> {
        return this.http
            .post(`/api/v1/relationship/invitationCode/${invitationCode}/notifyDelegate`, JSON.stringify(notification), {
                headers: this.headersForJson()
            })
            .map(this.extractData);
    }

    public createRelationship(relationship: IRelationshipAddDTO): Rx.Observable<IRelationship> {
        return this.http
            .post(`/api/v1/relationship`, JSON.stringify(relationship), {
                headers: this.headersForJson()
            })
            .map(this.extractData);
    }

    private headersForJson() {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return headers;
    }

}