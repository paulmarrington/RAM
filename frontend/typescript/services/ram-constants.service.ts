import { Injectable } from 'angular2/core';

@Injectable()
export class RAMConstantsService {
    public PageSizeOptions = [5, 10, 25, 100];
    public DefaultPageSize = 5;
}

