import {Component} from '@angular/core';

import 'ng2-bootstrap';
import {Identity} from '../../../../commons/RamAPI';
import {IdentityService} from './identity.service';
import {ErrorService} from '../error/error.service';

@Component({
    selector: '.user-details',
    templateUrl: 'identity.component.html'
})

export class IdentityComponent {
    public me: Identity;

    constructor (private identityService: IdentityService, private errorService: ErrorService) {
    }

    public ngOnInit() {
        this.identityService.getMe()
            .subscribe(
                identity => {
                    this.me = identity;
                },
                error => this.errorService.handleError(error)
            );
    }

}