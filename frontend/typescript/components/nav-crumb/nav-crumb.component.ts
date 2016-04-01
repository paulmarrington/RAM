import {EventEmitter, Input, Component, OnInit } from "angular2/core";
import {NavReq, NavRes, IRelationshipQuickInfo} from "../../../../commons/RamAPI";
import {RAMNavService} from "../../services/ram-nav.service";
import {Subject, Observable} from "rxjs";

@Component({
    selector: "nav-crumb",
    templateUrl: "nav-crumb.component.html",
    providers: [RAMNavService]
})
export class NavCrumbComponent implements OnInit {
    relChain: Observable<IRelationshipQuickInfo[]>;

    constructor(private nav: RAMNavService) {
        this.relChain = this.nav.navSource$.map(res => res.partyChain);
    }

    ngOnInit() {
        // this.nav.navSource$.subscribe(data => {
        //     this.relChain = data.partyChain;
        // });
    }

}