import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs';

@Injectable()
export class RAMNavService {

    private _navSource = new ReplaySubject<string[]>(1);

    private _navObservable$ = this._navSource.asObservable();

    private _currentRelIds = new Array<string>();
    private _currentRelId = '';

    public get navObservable$() {
        return this._navObservable$;
    }

    public navigateToRel(relIds: string[]) {
        this._currentRelIds = relIds;
        this._currentRelId = relIds.slice(-1)[0];
        this._navSource.next(this._currentRelIds);
    }

    public get currentIdentityName() {
        return this._currentRelId;
    }

    constructor() {
        this.navigateToRel([]);
    }
}
