import { Injectable } from "angular2/core";

@Injectable()
export class RAMConstantsService {
    PageSizeOptions = [5, 10, 25, 100];
    DefaultPageSize = 5;
}

