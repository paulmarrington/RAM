import {Component} from '@angular/core';
import {HTTP_PROVIDERS} from '@angular/http';
import {RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from '@angular/router-deprecated';
import {RAMRestService} from '../../services/ram-rest.service';
import {RAMNavService} from '../../services/ram-nav.service';
import {RAMConstantsService} from '../../services/ram-constants.service';
import {RelationshipsComponent} from '../relationships/relationships.component';
import {AddRelationshipComponent} from '../add-relationship/add-relationship.component';
import {AddRelationshipCompleteComponent} from '../add-relationship-complete/add-relationship-complete.component';
import {AcceptAuthorisationComponent} from '../accept-authorisation/accept-authorisation.component';
import {EnterInvitationCodeComponent} from '../enter-invitation-code/enter-invitation-code.component';
import {RAMIdentityService} from '../../services/ram-identity.service';

import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {provide} from '@angular/core';
import 'ng2-bootstrap';
import {ErrorComponent} from '../error/error.component';
import {ErrorService} from '../error/error.service';
import {IdentityComponent} from '../identity/identity.component';
import {IdentityService} from '../identity/identity.service';
import {RamComponent} from '../ram/ram.component';

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
        RAMIdentityService,
        RAMConstantsService,
        IdentityService,
        ErrorService
    ]
})
@RouteConfig([
    { path: '/', name: 'Ram', component: RamComponent, useAsDefault: true },

    {
        path: '/relationships/:idValue',
        name: 'Relationships',
        component: RelationshipsComponent
    }, {
        path: '/relationships/add/:idValue',
        name: 'AddRelationship',
        component: AddRelationshipComponent
    }, {
        path: '/relationships/add/:idValue/:invitationCode/:displayName/complete',
        name: 'AddRelationshipCompleteComponent',
        component: AddRelationshipCompleteComponent
    }, {
        path: '/relationships/add/:idValue/enter',
        name: 'EnterInvitationCodeComponent',
        component: EnterInvitationCodeComponent
    },{
        path: '/relationships/add/:idValue/:invitationCode/accept',
        name: 'AcceptAuthorisationComponent',
        component: AcceptAuthorisationComponent
    }
])
export class AppComponent {
}