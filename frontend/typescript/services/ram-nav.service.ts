import {Injectable} from 'angular2/core';
import {ReplaySubject} from 'rxjs';

@Injectable()
export class RAMNavService {

    private _navSource = new ReplaySubject<string[]>(1);

    private _navObservable$ = this._navSource.asObservable();

    public get navObservable$() {
        return this._navObservable$;
    }

    public navigateToRel(relIds: string[]) {
        this._navSource.next(relIds);
    }

    constructor() {
        this.navigateToRel([]);
    }
}
