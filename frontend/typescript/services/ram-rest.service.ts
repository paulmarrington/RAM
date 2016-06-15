import { Injectable } from '@angular/core';
import {
    RelationshipSearchDTO, HrefValue, Relationship2, Name2
} from '../../../commons/RamAPI';

import { Observable, BehaviorSubject } from 'rxjs/Rx';
import {Response, Http} from '@angular/http';

// TODO: pass in Party2 and use identity name if no nickname
const whatName = (nickname:Name2) => {
    if (nickname.unstructuredName) {
        return nickname.unstructuredName;
    } else {
        return nickname.givenName + ' ' + nickname.familyName;
    }
};

const relationshipsToTable = (relationshipSearchDTO: RelationshipSearchDTO, relType: string):IRelationshipTableRes => {
    const relationshipDTOToTable = (relref: HrefValue<Relationship2>):IRelationshipTableRow => {
        const rel = relref.value;
        const relationshipType = rel.relationshipType.href.split('/').slice(-1);
        return {
            name:       whatName(rel[relType+'NickName']),
            subName:    '', // TODO: extract ABN when server provides it
            rel:        relationshipType[0],
            access:     'Universal',
            status:     rel.status
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

const sampleRelationshipSearchResponseData = {
  'totalCount': 2,
  'pageSize': 10,
  'list': [
    {
      'href': '/api/v1/relationship/575ffc7cb4ceb0016f7f98f7',
      'value': {
        'relationshipType': {
          'href': '/api/v1/relationshipType/CUSTOM_REPRESENTATIVE'
        },
        'subject': {
          'href': '/api/v1/party/identity/PUBLIC_IDENTIFIER:ABN:jenscatering_identity_1',
          'value': {
            'partyType': 'ABN',
            'identities': [
              {
                'href': '/api/v1/identity/PUBLIC_IDENTIFIER:ABN:jenscatering_identity_1'
              }
            ]
          }
        },
        'subjectNickName': {
          'unstructuredName': 'Jen\'s Catering Pty Ltd'
        },
        'delegate': {
          'href': '/api/v1/party/identity/LINK_ID:MY_GOV:jennifermaxims_identity_1',
          'value': {
            'partyType': 'INDIVIDUAL',
            'identities': [
              {
                'href': '/api/v1/identity/LINK_ID:MY_GOV:jennifermaxims_identity_1'
              }
            ]
          }
        },
        'delegateNickName': {
          'givenName': 'Jennifer',
          'familyName': 'Maxims'
        },
        'startTimestamp': '2016-06-14T12:45:48.611Z',
        'status': 'ACTIVE'
      }
    },
    {
      'href': '/api/v1/relationship/575ffc7cb4ceb0016f7f98fd',
      'value': {
        'relationshipType': {
          'href': '/api/v1/relationshipType/CUSTOM_REPRESENTATIVE'
        },
        'subject': {
          'href': '/api/v1/party/identity/PUBLIC_IDENTIFIER:ABN:jenscatering_identity_1',
          'value': {
            'partyType': 'ABN',
            'identities': [
              {
                'href': '/api/v1/identity/PUBLIC_IDENTIFIER:ABN:jenscatering_identity_1'
              }
            ]
          }
        },
        'subjectNickName': {
          'unstructuredName': 'Jen\'s Catering Pty Ltd'
        },
        'delegate': {
          'href': '/api/v1/party/identity/INVITATION_CODE:jEVYNX',
          'value': {
            'partyType': 'INDIVIDUAL',
            'identities': [
              {
                'href': '/api/v1/identity/INVITATION_CODE:jEVYNX'
              }
            ]
          }
        },
        'delegateNickName': {
          'givenName': 'Fred',
          'familyName': 'Johnson'
        },
        'startTimestamp': '2016-06-14T12:45:48.718Z',
        'status': 'PENDING'
      }
    }
  ]
};

@Injectable()
export class RAMRestService {

    constructor(private http: Http) {}

    public getRelationshipTableData(identityValue: string, isDelegate: boolean, relPathIds: string[],
        filters: RelationshipTableReq, pageNo: number, pageSize: number
    ): Observable<IRelationshipTableRes> {
        const relType = (isDelegate ? 'delegate' : 'subject');

        const relationshipSearchDTOToTable = (relationshipSearchDTO: RelationshipSearchDTO) : IRelationshipTableRes => {
            return relationshipsToTable(relationshipSearchDTO, relType);
        };

        // TODO: add filters to URL
        const url = `relationships/${relType}/identity/:${identityValue}?page=${pageNo}`;
        // const url = `parties/identities/${identityValue}/relationships/${relType}?pageSize=${pageSize}&pageNumber=${pageNo}`;

        // temporary until we talk to real server
        const data = relationshipSearchDTOToTable(sampleRelationshipSearchResponseData);
        const tableBS:BehaviorSubject<IRelationshipTableRes> = new BehaviorSubject(data);
        return tableBS.asObservable();

        // return = this.http
        // .get(url)
        // .map(this.extractData)
        // .map(relationshipSearchDTOToTable)
        // .publishReplay()
        // .refCount();
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
        return body.data || {};
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