export enum RAMMessageType {
    Error = 1,
    Info = 2,
    Success = 3
}

export interface IResponse<T> {
    data?: T;
    token?: string;
    status: number; // status code
    alert?: Alert;
}

export interface Alert {
    messages: string[];
    alertType: RAMMessageType;
}

export class ErrorResponse implements IResponse<void>{
    alert: Alert;
    constructor(public status: number,
        messages: string | string[],
        alertType: number = RAMMessageType.Error) {
        
        if (Array.isArray(messages)) {
            this.alert = { messages: messages, alertType: alertType };
        } else {
            this.alert = { messages: [messages], alertType: alertType };
        }
    }
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
    table: IRelationshipTableRow[];
    relationshipOptions: Array<string>;
    accessLevelOptions: Array<string>;
    statusValueOptions: Array<string>;
}

export class EmptyRelationshipTableRes implements IRelationshipTableRes {
    total = 0;
    table = new Array<IRelationshipTableRow>();
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
