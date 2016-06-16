import {Component} from '@angular/core';
import {RAMNavService} from '../../services/ram-nav.service';
import {RAMRestService} from '../../services/ram-rest.service';

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

    public get currentIdentity() { return this.nav.currentIdentityName; }

}