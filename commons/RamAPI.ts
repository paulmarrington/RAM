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

export class DataResponse<T>{
    constructor(public data: T) { }
    isError: boolean = false;
}

export interface IDataTableResponse<T> {
    total: number;
    data: T[];
    relationshipOptions: IKeyValue<string>[];
    accessLevelOptions: IKeyValue<string>[];
    statusValueOptions: IKeyValue<string>[];
}

/**
 * A RAMObject defines the common attributes that all objects in the RAM model will contain.
 *  Most objects in RAM extend off the RAMObject.
 * PK is _id(used by mongo) and (id,lastUpdatedTimestamp) because we can then version on entity
 */

export interface IKeyValue<T> {
    key: string;
    value: T;
}

export interface Sample {
    name: string;
    rel: string;
    access: string;
    status: string;
    abn?: string;
}

export class EmptyDataTableResponse implements IDataTableResponse<Sample> {
    total = 0;
    data = new Array<Sample>();
    relationshipOptions = new Array<IKeyValue<string>>();
    accessLevelOptions = new Array<IKeyValue<string>>();
    statusValueOptions = new Array<IKeyValue<string>>();
}

export class RelationshipTableUpdateRequest {
    constructor(public pageSize: number,
        public pageNumber: number,
        public filters: { [index: string]: string },
        public sortByField: string) {

    }
}
