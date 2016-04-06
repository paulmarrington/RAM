import {Inject, Injectable, EventEmitter} from "angular2/core";
import {RAMRestService} from "./ram-rest.service";
import {Subject, Observable, Subscription} from "rxjs";
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

    private _navSource = new Subject<NavRes>();

    private _navSubscription: Subscription = null;

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
        this.rest.navTo(req).map((body) => body.data).subscribe((res) => this._navSource.next(res));
    }

    constructor( @Inject(RAMRestService) private rest: RAMRestService) {
        console.log("Created");
        this.navigateToRel();
    }
}