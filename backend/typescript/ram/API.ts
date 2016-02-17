export interface IResponse {
    isError:boolean;
}

export class ErrorResponse implements IResponse {
    constructor(public errorCode: number,
        public errorMessage: string = "") {  }

    isError :boolean = true;
}

export class ErrorResponseWithData<T> implements IResponse {
    constructor(public data: T, public errorCode: number, public errorMessage: string = "") { }
    isError :boolean = true;
}

export class DataResponse<T>{
    constructor(public data: T) { }
    isError :boolean = false;
}
/**
 * IRamConf is used for providing type safety over configuration
 * file provided through environment variable
 */
export interface IRamConf {
    frontendDir:string
    logDir:string
    httpPort:number
    mongoURL:string
    devMode:boolean
}