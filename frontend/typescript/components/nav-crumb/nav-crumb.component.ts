import {EventEmitter, Input, Component, OnInit } from "angular2/core";
import {NavReq, NavRes, IRelationshipQuickInfo} from "../../../../commons/RamAPI";
import {RAMNavService} from "../../services/ram-nav.service";
import {Subject, Observable} from "rxjs";
// import * as _ from "lodash";

@Component({
    selector: "nav-crumb",
    templateUrl: "nav-crumb.component.html"
})
export class NavCrumbComponent implements OnInit {
    relChain$: Observable<IRelationshipQuickInfo[]>;
    subjectUser$: Observable<IRelationshipQuickInfo>;

    constructor(private nav: RAMNavService) {

    }

    navigateTo(relId: string) {
        this.nav.navigateToRel(relId);
    }

    ngOnInit() {
        this.relChain$ = this.nav.navObservable$.map(res =>res.partyChain);
        this.subjectUser$ = this.nav.navObservable$.do(d => console.log(d)).map(v => v.partyChain[v.partyChain.length-1]);
    }

}