import { Injectable } from 'angular2/core';
import {
    RelationshipTableReq,
    IRelationshipTableRes
} from '../../../commons/RamAPI';

import Rx from 'rxjs/Rx';
import {Response, Http} from 'angular2/http';

@Injectable()
export class RAMRestService {

    constructor(private http: Http) {
    }

    public getRelationshipTableData(identityResolver: string, identityValue: string, isDelegate: boolean, relPathIds: string[],
        filters: RelationshipTableReq, pageNo: number, pageSize: number
    ): Rx.Observable<IRelationshipTableRes> {
        const url = `/api/v1/relationship/table/${isDelegate ? 'delegate' : 'subject'}`
            +
            `/${identityValue}/${identityResolver}/page/${pageNo}/size/${pageSize}`;
        return this.http.get(url).map(this.extractData).publishReplay().refCount();
    }

    private extractData(res: Response) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Status code is:' + res.status);
        }
        const body = res.json();
        return body.data || {};
    }

}