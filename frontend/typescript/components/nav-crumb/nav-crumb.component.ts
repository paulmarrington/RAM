import {Component, OnInit } from 'angular2/core';
import {IResponse, NavRes, IRelationshipQuickInfo} from '../../../../commons/RamAPI';
import {RAMNavService} from '../../services/ram-nav.service';
import {RAMRestService} from '../../services/ram-rest.service';
import {Observable} from 'rxjs';
// import * as _ from 'lodash';

@Component({
    selector: 'nav-crumb',
    templateUrl: 'nav-crumb.component.html'
})
export class NavCrumbComponent implements OnInit {
    private _relChain$: Observable<IRelationshipQuickInfo[]>;
    private _subjectUser$: Observable<IRelationshipQuickInfo>;
    private _partyId = 'Magic123';

    constructor(private nav: RAMNavService, private rest: RAMRestService) {
    }

    public navigateTo(relId: string[]) {
        this.nav.navigateToRel(relId);
    }

    public ngOnInit() {
        this._relChain$ = this.nav.navObservable$.switchMap(res => {
            return this.rest.getNavCrumb(this._partyId, res);
        }).map((res: IResponse<NavRes>) => res.data.partyChain);

        this._subjectUser$ = this._relChain$.map(v => v[v.length - 1]);
    }

}