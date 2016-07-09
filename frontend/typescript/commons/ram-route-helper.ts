import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

@Injectable()
export class RAMRouteHelper {

    constructor(private router: Router) {
    }

    public goToRelationshipsPage(idValue: string) {
        this.router.navigate(['/relationships', encodeURIComponent(idValue)]);
    }

    public goToRelationshipAddPage(idValue: string) {
        this.router.navigate(['/relationships/add', encodeURIComponent(idValue)]);
    }

    public goToRelationshipEnterCodePage(idValue: string) {
        this.router.navigate(['/relationships/add/enter', encodeURIComponent(idValue)]);
    }

    public goToRelationshipAcceptPage(idValue: string, code: string) {
        this.router.navigate(['/relationships/add/accept',
            encodeURIComponent(idValue),
            encodeURIComponent(code)
        ]);
    }

}

