import {Component} from '@angular/core';
import {HTTP_PROVIDERS} from '@angular/http';
import {RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from '@angular/router-deprecated';
import {RAMRestService} from '../../services/ram-rest.service';
import {RAMNavService} from '../../services/ram-nav.service';
import {RAMConstantsService} from '../../services/ram-constants.service';
import {RelationshipsComponent} from '../relationships/relationships.component';
import {AddRelationshipComponent} from '../add-relationship/add-relationship.component';

import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {provide} from '@angular/core';
import 'ng2-bootstrap';
import {ErrorComponent} from '../error/error.component';
import {ErrorService} from '../error/error.service';
import {IdentityComponent} from '../identity/identity.component';
import {IdentityService} from '../identity/identity.service';
import {RamComponent} from '../ram/ram.component';
import {AuthorisationComponent} from '../authorisations/authorisation.component';

@Component({
    selector: 'ram-app',
    templateUrl: 'app.component.html',
    directives: [ROUTER_DIRECTIVES, IdentityComponent, ErrorComponent],
    providers: [
        HTTP_PROVIDERS,
        ROUTER_PROVIDERS,
        provide(LocationStrategy, { useClass: HashLocationStrategy }),
        RAMRestService,
        RAMNavService,
        RAMConstantsService,
        IdentityService,
        ErrorService
    ]
})
@RouteConfig([
    {path: '/', name: 'Ram', component: RamComponent, useAsDefault: true},
    {path: '/authorisation  ', name: 'Authorisation', component: AuthorisationComponent},

    {
        path: '/relationships/:identityValue/:identityResolver',
        name: 'Relationships',
        component: RelationshipsComponent
    },{
        path: '/relationships/add',
        name: 'AddRelationship',
        component: AddRelationshipComponent
    }
])
export class AppComponent {
}