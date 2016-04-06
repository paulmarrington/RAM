import {EventEmitter, Input, Component, OnInit } from "angular2/core";
import {NavReq, NavRes, IRelationshipQuickInfo} from "../../../../commons/RamAPI";
import {RAMNavService} from "../../services/ram-nav.service";
import {Subject, Observable} from "rxjs";

@Component({
    selector: "nav-crumb",
    templateUrl: "nav-crumb.component.html"
})
export class NavCrumbComponent implements OnInit {
    relChain: Observable<IRelationshipQuickInfo[]>;

    constructor(private nav: RAMNavService) {
    }

    navigateTo(relId: string) {
        this.nav.navigateToRel(relId);
    }

    ngOnInit() {
        this.relChain = this.nav.navObservable$
            .map(res => res.partyChain);
    }

}