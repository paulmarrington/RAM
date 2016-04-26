import {Component} from 'angular2/core';
import {IRelationshipQuickInfo} from '../../../../commons/RamAPI';
import {RAMNavService} from '../../services/ram-nav.service';
import {RAMRestService} from '../../services/ram-rest.service';
import {Observable} from 'rxjs';
// import * as _ from 'lodash';

@Component({
    selector: 'nav-crumb',
    templateUrl: 'nav-crumb.component.html'
})
export class NavCrumbComponent {
    private _relChain$: Observable<IRelationshipQuickInfo[]>;
    private _subjectUser$: Observable<IRelationshipQuickInfo>;

    public get subjectUser$() {
        return this._subjectUser$;
    }

    public get relChain$() {
        return this._relChain$;
    }
    constructor(private nav: RAMNavService, private rest: RAMRestService) {
    }

    public navigateTo(relId: string[]) {
        this.nav.navigateToRel(relId);
    }

}