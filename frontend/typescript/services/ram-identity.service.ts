import { Injectable } from '@angular/core';
import {RAMRestService} from './ram-rest.service';
import {IIdentity, IName} from '../../../commons/RamAPI2';
import Rx from 'rxjs/Rx';

@Injectable()
export class RAMIdentityService {

    private _identityCache: { [index: string]: IName } = {};

    constructor(private rest: RAMRestService) {
    }

    public getDefaultName(identityValue: string): Rx.Observable<IName> {
        if (this._identityCache[identityValue]) {
            return Rx.Observable.of(this._identityCache[identityValue]);
        } else {
            return this.rest
                .findIdentityByValue(identityValue)
                .map((identity: IIdentity) => identity.profile.name)
                .do((profileName) => this._identityCache[identityValue] = profileName)
                .publishReplay()
                .refCount();
        }
    }
}