import Rx from 'rxjs/Rx';
import {ActivatedRoute, Router} from '@angular/router';

export class RouterParamsHelper {

    public static params(route: ActivatedRoute, router: Router) {

        const pathParams$ = route.params;
        const queryParams$ = router.routerState.queryParams;

        return Rx.Observable.merge(pathParams$, queryParams$);

    }

}