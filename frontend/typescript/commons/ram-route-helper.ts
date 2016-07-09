import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

@Injectable()
export class RAMRouteHelper {

    constructor(private router: Router) {
    }

    public goToRelationshipsPage(idValue: string) {
        this.router.navigate(['/relationships', encodeURIComponent(idValue)]);
    }

    public goToRelationshipsAddPage(idValue: string) {
        this.router.navigate(['/relationships/add', encodeURIComponent(idValue)]);
    }

    public goToRelationshipsEnterCodePage(idValue: string) {
        this.router.navigate(['/relationships/add/enter', encodeURIComponent(idValue)]);
    }

}

