import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES, ActivatedRoute, Router, Params} from '@angular/router';

import {AbstractPageComponent} from '../abstract-page/abstract-page.component';
import {RAMModelHelper} from '../../commons/ram-model-helper';
import {RAMRestService} from '../../services/ram-rest.service';

@Component({
    selector: 'landing-home',
    templateUrl: 'welcome-home.component.html',
    directives: [ROUTER_DIRECTIVES]
})

export class WelcomeHomeComponent extends AbstractPageComponent {

    constructor(route: ActivatedRoute,
                router: Router,
                modelHelper: RAMModelHelper,
                rest: RAMRestService) {
        super(route, router, modelHelper, rest);
    }

    public onInit(params: {path: Params, query: Params}) {

        // logged in identity
        this.rest.findMyIdentity().subscribe(identity => {
            const idValue = identity.idValue;
            this.router.navigate(['/relationships', encodeURIComponent(idValue)]);
        });

    }

}