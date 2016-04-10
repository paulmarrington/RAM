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

    private _navSource = new ReplaySubject<NavRes>(1);

    navObservable$ = this._navSource.asObservable();

    navigateToHome() {
        this.navigateToRel("");
    }
    /**
     * @param  {string} relId?
     * when relationshipId is not passed, means GET request
     * when relationshipId is passed means PUT request (nav to a relationship from the current node)
     * when relationshipId is empty string means POST request (go to root node - reset action)
     * @returns Promise
     */
    navigateToRel(relId?: string) {
        const req = new NavReq(relId);
        this.rest.navTo(req).subscribe(d => this._navSource.next(d.data));
    }

    constructor( @Inject(RAMRestService) private rest: RAMRestService) {
        this.navigateToRel();
    }
}