import {Component} from '@angular/core';
import {HTTP_PROVIDERS} from '@angular/http';
import {ROUTER_DIRECTIVES } from '@angular/router';
import {RAMRestService} from '../../services/ram-rest.service';
import {RAMNavService} from '../../services/ram-nav.service';
import {RAMConstantsService} from '../../services/ram-constants.service';
import {RAMIdentityService} from '../../services/ram-identity.service';
import 'ng2-bootstrap';
import {ErrorComponent} from '../error/error.component';
import {ErrorService} from '../error/error.service';
import {IdentityComponent} from '../identity/identity.component';
import {IdentityService} from '../identity/identity.service';

@Component({
    selector: 'ram-app',
    templateUrl: 'app.component.html',
    directives: [ROUTER_DIRECTIVES, IdentityComponent, ErrorComponent],
    providers: [
        HTTP_PROVIDERS,
        RAMRestService,
        RAMNavService,
        RAMIdentityService,
        RAMConstantsService,
        IdentityService,
        ErrorService
    ]
})

export class AppComponent {
}