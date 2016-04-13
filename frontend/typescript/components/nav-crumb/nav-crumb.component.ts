import {EventEmitter, Input, Component, OnInit } from "angular2/core";
import {IResponse,NavReq, NavRes, IRelationshipQuickInfo} from "../../../../commons/RamAPI";
import {RAMNavService} from "../../services/ram-nav.service";
import {RAMRestService} from "../../services/ram-rest.service";
import {Subject, Observable} from "rxjs";
// import * as _ from "lodash";

@Component({
    selector: "nav-crumb",
    templateUrl: "nav-crumb.component.html"
})
export class NavCrumbComponent implements OnInit {
    relChain$: Observable<IRelationshipQuickInfo[]>;
    subjectUser$: Observable<IRelationshipQuickInfo>;
    partyId = "Magic123";

    constructor(private nav: RAMNavService,private rest:RAMRestService) {
    }

    navigateTo(relId: string[]) {
        this.nav.navigateToRel(relId);
    }

    ngOnInit() {
        this.relChain$ = this.nav.navObservable$.switchMap(res => {
            return this.rest.getNavCrumb(this.partyId, res);
        }).map((res: IResponse<NavRes>) => res.data.partyChain);

        this.subjectUser$ = this.relChain$.map(v => v[v.length-1]);
    }

}