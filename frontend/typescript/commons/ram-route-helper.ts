import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

@Injectable()
export class RAMRouteHelper {

    constructor(private router: Router) {
    }

    public goToRelationshipsPage(idValue: string, filter?: string, page?: number) {
        const queryParams = {};
        if (filter) {
            queryParams['filter'] = filter;
        }
        if (page) {
            queryParams['page'] = page;
        }
        this.router.navigate(['/relationships',
            encodeURIComponent(idValue)],
            {queryParams: queryParams}
        );
    }

    public goToRelationshipAddPage(idValue: string) {
        this.router.navigate(['/relationships/add', encodeURIComponent(idValue)]);
    }

    public goToRelationshipAddCompletePage(idValue: string, code: string, displayName: string) {
        this.router.navigate(['relationships/add/complete',
            encodeURIComponent(idValue),
            encodeURIComponent(code),
            encodeURIComponent(displayName)
        ]);
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

