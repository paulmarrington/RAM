import {Component} from '@angular/core';
import {HTTP_PROVIDERS} from '@angular/http';
import {RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from '@angular/router-deprecated';
import {RAMRestService} from '../../services/ram-rest.service';
import {RAMNavService} from '../../services/ram-nav.service';
import {RAMConstantsService} from '../../services/ram-constants.service';
import {RelationshipsComponent} from '../relationships/relationships.component';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {provide} from '@angular/core';
import 'ng2-bootstrap';

@Component({
    selector: 'ram-app',
    templateUrl: 'app.component.html',
    directives: [ROUTER_DIRECTIVES],
    providers: [
        HTTP_PROVIDERS,
        ROUTER_PROVIDERS,
        provide(LocationStrategy, { useClass: HashLocationStrategy }),
        RAMRestService,
        RAMNavService,
        RAMConstantsService
    ]
})
@RouteConfig([
    {
        path: '/relationships/:identityValue/:identityResolver',
        name: 'Relationships',
        component: RelationshipsComponent
    }
])
export class AppComponent {
}