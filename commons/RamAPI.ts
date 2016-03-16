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

/**
 * A RAMObject defines the common attributes that all objects in the RAM model will contain.
 *  Most objects in RAM extend off the RAMObject.
 * PK is _id(used by mongo) and (id,lastUpdatedTimestamp) because we can then version on entity
 */

