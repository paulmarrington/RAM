namespace ram{

    export interface IResponse {
        isError: boolean;
    }

    export class ErrorResponse implements IResponse {
        constructor(public errorCode: number,
            public errorMessage: string = "") { }

        isError: boolean = true;
    }

    export class ErrorResponseWithData<T> implements IResponse {
        constructor(public data: T, public errorCode: number, public errorMessage: string = "") { }
        isError: boolean = true;
    }

    export class DataResponse<T>{
        constructor(public data: T) { }
        isError: boolean = false;
    }

    export class BusinessName {
        constructor(public name: string, public abn: string) { }
    }

    export class IndividualBusinessAuthorisation {
        constructor(
            public businessName: string,
            public abn: string,
            public activeOn: Date,
            public authorisationStatus: AuthorisationStatus,
            public accessLevel: AccessLevels,
            public expiresOn?: Date) { }
    }
}
