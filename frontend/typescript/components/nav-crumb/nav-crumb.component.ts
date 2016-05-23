import {Component} from '@angular/core';
import {RAMNavService} from '../../services/ram-nav.service';
import {RAMRestService} from '../../services/ram-rest.service';
// import * as _ from 'lodash';

@Component({
    selector: 'nav-crumb',
    templateUrl: 'nav-crumb.component.html'
})
export class NavCrumbComponent {

    constructor(private nav: RAMNavService, private rest: RAMRestService) {
    }

    public navigateTo(relId: string[]) {
        this.nav.navigateToRel(relId);
    }

}