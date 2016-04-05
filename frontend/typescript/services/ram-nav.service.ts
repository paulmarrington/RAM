import {Inject, Injectable, EventEmitter} from "angular2/core";
import {RAMRestService} from "./ram-rest.service";
import {Subject, Observable} from "rxjs";
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
    private _seqNo = 0;

    navSource$ = this._navSource.asObservable();

    private _navRes: NavRes;

    getNav() {
        return this._navRes;
    }

    getCurrentState(): Promise<NavRes> {
        return this.navigateToRel();
    }

    navigateToHome(): Promise<NavRes> {
        return this.navigateToRel("");
    }
    /**
     * @param  {string} relId?
     * when relationshipId is not passed, means GET request
     * when relationshipId is passed means PUT request (nav to a relationship from the current node)
     * when relationshipId is empty string means POST request (go to root node - reset action)
     * @returns Promise
     */
    navigateToRel(relId?: string): Promise<NavRes> {
        const req = new NavReq(relId, ++this._seqNo);
        return this.rest.navTo(req).then((body) => {
            if (body.data.seqNo === this._seqNo) {
                this._navRes = body.data;
                this._navSource.next(body.data);
                return body.data;
            }
        });
    }

    constructor( @Inject(RAMRestService) private rest: RAMRestService) {
        const relationshipId = "magicInitialUUID";
        this.navigateToRel(relationshipId);
    }
}