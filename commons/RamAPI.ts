export interface IResponse {
    isError: boolean;
}

export class ErrorResponse implements IResponse {
    constructor(public errorCode: number,
        public errorMessage: string) { }

    isError: boolean = true;
}

export class ErrorResponseWithData<T> implements IResponse {
    constructor(public data: T, public errorCode: number, public errorMessage: string) { }
    isError: boolean = true;
}

export class DataResponse<T> implements IResponse{
    constructor(public data: T) { }
    isError: boolean = false;
}

export interface IKeyValue<T> {
    key: string;
    value: T;
}

/***************************************************
 *            RELATIONSHIP TABLE
 ***************************************************/
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
    data: IRelationshipTableRow[];
    relationshipOptions: Array<string>;
    accessLevelOptions: Array<string>;
    statusValueOptions: Array<string>;
}

export class EmptyRelationshipTableRes implements IRelationshipTableRes {
    total = 0;
    data = new Array<IRelationshipTableRow>();
    relationshipOptions = new Array<string>();
    accessLevelOptions = new Array<string>();
    statusValueOptions = new Array<string>();
}

export interface IRelationshipTableRow {
    name: string;
    subName?: string;
    relId: string;
    rel: string;
    access: string;
    status: string;
}

/***************************************************
 *            NAVIGATION
 ***************************************************/

export class NavReq {
    constructor(public relId?: string) {}
}

export class NavRes {
    partyChain: IRelationshipQuickInfo[];
}

export interface IRelationshipQuickInfo {
    id: string;
    name: string;
    subName?: string;
}
