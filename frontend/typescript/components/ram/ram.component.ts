// TODO this component need to be deleted or migrated to project standards
import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {RAMRestService} from '../../services/ram-rest.service';

@Component({
    selector: 'ram-app',
    templateUrl: 'ram.component.html'
})
export class RamComponent {

    constructor(private router: Router,
                private rest: RAMRestService) {
    }

    public ngOnInit() {
        this.rest.findMyIdentity().subscribe(identity => {
            const idValue = identity.idValue;
            this.router.navigate(['Relationships', { idValue: idValue }]);
        });
    }

}