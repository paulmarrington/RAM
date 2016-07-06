import { Injectable } from '@angular/core';
import {
    RelationshipSearchDTO, IHrefValue, IRelationship, IName
} from '../../../commons/RamAPI2';

import { Observable } from 'rxjs/Rx';
import {Response, Http} from '@angular/http';

// TODO: pass in Party2 and use identity name if no nickname
const whatName = (nickname:IName) => {
    if (nickname.unstructuredName) {
        return nickname.unstructuredName;
    } else {
        return nickname.givenName + ' ' + nickname.familyName;
    }
};

const relationshipsToTable = (relationshipSearchDTO: RelationshipSearchDTO, isDelegate: boolean):IRelationshipTableRes => {
    const relType = (isDelegate ? 'delegate' : 'subject');
    const relationshipDTOToTable = (relref: IHrefValue<IRelationship>):IRelationshipTableRow => {
        const rel = relref.value;
        const relationshipType = rel.relationshipType.href.split('/').slice(-1);
        const relId = decodeURIComponent(rel.subject.href.split('/').slice(-1)[0]);
        return {
            name:       whatName(rel[relType+'NickName']),
            subName:    '', // TODO: extract ABN when server provides it
            rel:        relationshipType[0],
            access:     'Universal',
            status:     rel.status,
            relId:      relId
        } as IRelationshipTableRow;
    };

    const table:IRelationshipTableRow[] = relationshipSearchDTO.list.map(relationshipDTOToTable);

    return {
        total:                  relationshipSearchDTO.totalCount,
        table:                  table,
        relationshipOptions:    [] as Array<string>,
        accessLevelOptions:     [] as Array<string>,
        statusValueOptions:     [] as Array<string>
    };
};

@Injectable()
export class RAMRestService2 {

    constructor(private http: Http) {}

    public getRelationshipTableData(identityValue: string, isDelegate: boolean,
        filters: RelationshipTableReq, pageNo: number, pageSize: number
    ): Observable<IRelationshipTableRes> {
        const relType = (isDelegate ? 'subject' : 'delegate');

        const relationshipSearchDTOToTable = (relationshipSearchDTO: RelationshipSearchDTO) : IRelationshipTableRes => {
            return relationshipsToTable(relationshipSearchDTO, isDelegate);
        };

        // TODO: add filters to URL
        const url = `/api/v1/relationships/${relType}/identity/${identityValue}?page=${pageNo}`;

        return this.http
        .get(url)
        .map(this.extractData)
        .map(relationshipSearchDTOToTable)
        .publishReplay()
        .refCount();
    }

    // A call external to RAM to get organisation name from ABN
    public getOrganisationNameFromABN(abn:string) {
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
}

export class RelationshipTableReq {
    constructor(
        public pageSize: number,
        public pageNumber: number,
        public canActFor: boolean,
        public filters: { [index: string]: string },
        public sortByField: string
    ) {
    }
}

export interface IRelationshipTableRes {
    total: number;
    table: IRelationshipTableRow[];
    relationshipOptions: Array<string>;
    accessLevelOptions: Array<string>;
    statusValueOptions: Array<string>;
}

export interface IRelationshipTableRow {
    name: string;
    subName?: string;
    rel: string;
    access: string;
    status: string;
}