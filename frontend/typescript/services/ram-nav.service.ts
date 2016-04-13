import {Inject, Injectable, EventEmitter} from "angular2/core";
import {RAMRestService} from "./ram-rest.service";
import {ReplaySubject, Observable, Subscription} from "rxjs";
import {
    RelationshipTableReq,
    IRelationshipTableRes,
    IRelationshipQuickInfo,
    IKeyValue,
    IRelationshipTableRow,
    NavRes,
    NavReq}
from "../../../commons/RamAPI";

@Injectable()
export class RAMNavService {

    private _navSource = new ReplaySubject<string[]>(1);

    navObservable$ = this._navSource.asObservable();

    navigateToRel(relIds: string[]) {
        this._navSource.next(relIds);
    }

    constructor() {
        this.navigateToRel([]);
    }
}