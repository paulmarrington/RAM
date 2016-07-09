import Rx from 'rxjs/Rx';
import {OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router, Params} from '@angular/router';

import {RAMRestService} from '../../services/ram-rest.service';
import {RAMModelHelper} from '../../commons/ram-model-helper';
import {RAMRouteHelper} from '../../commons/ram-route-helper';

export abstract class AbstractPageComponent implements OnInit, OnDestroy {

    protected mergedParamSub: Rx.Subscription;
    protected pathParamSub: Rx.Subscription;
    protected queryParamSub: Rx.Subscription;

    constructor(public route: ActivatedRoute,
                public router: Router,
                public rest: RAMRestService,
                public modelHelper: RAMModelHelper,
                public routeHelper: RAMRouteHelper) {
    }

    /* tslint:disable:max-func-body-length */
    public ngOnInit() {

        let pathParams: Params;
        let queryParams: Params;

        const pathParams$ = this.route.params;
        const queryParams$ = this.router.routerState.queryParams;

        this.mergedParamSub = Rx.Observable.merge(pathParams$, queryParams$)
            .subscribe((params) => {
                if (!pathParams) {
                    this.log('-----------');
                    this.log('[i] PATH  = ' + JSON.stringify(params));
                    pathParams = params;
                } else if (!queryParams) {
                    this.log('[i] QUERY = ' + JSON.stringify(params));
                    queryParams = params;
                    this.onInit({path: pathParams, query: queryParams});
                } else if (this.mergedParamSub) {
                    this.log('-----------');
                    this.log('Unsubscribing from merged observable ...');
                    this.mergedParamSub.unsubscribe();
                    this.pathParamSub = pathParams$.subscribe((params) => {
                        if (!this.isEqual(pathParams, params)) {
                            this.log('-----------');
                            pathParams = params;
                            this.log('[p] PARAMS = ' + JSON.stringify(params));
                            this.log('[p] PATH   = ' + JSON.stringify(pathParams));
                            this.log('[p] QUERY  = ' + JSON.stringify(queryParams));
                            this.onInit({path: pathParams, query: queryParams});
                        }
                    });
                    this.queryParamSub = queryParams$.subscribe((params) => {
                        if (!this.isEqual(queryParams, params)) {
                            this.log('-----------');
                            queryParams = params;
                            this.log('[p] PARAMS = ' + JSON.stringify(params));
                            this.log('[p] PATH   = ' + JSON.stringify(pathParams));
                            this.log('[p] QUERY  = ' + JSON.stringify(queryParams));
                            this.onInit({path: pathParams, query: queryParams});
                        }
                    });
                }
            });

    }

    public ngOnDestroy() {
        if (this.mergedParamSub) {
            this.mergedParamSub.unsubscribe();
        }
        if (this.pathParamSub) {
            this.pathParamSub.unsubscribe();
        }
        if (this.queryParamSub) {
            this.queryParamSub.unsubscribe();
        }
        this.onDestroy();
    }

    /* tslint:disable:no-empty */
    public onInit(params: {path: Params, query: Params}) {
    }

    /* tslint:disable:no-empty */
    public onDestroy() {
    }

    private isEqual(params1: Params, params2: Params): boolean {
        return params1 && params2 && JSON.stringify(params1) === JSON.stringify(params2);
    }

    private log(msg: string): void {
        //console.log(msg);
    }

}