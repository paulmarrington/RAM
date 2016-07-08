import Rx from 'rxjs/Rx';
import {OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router, Params} from '@angular/router';
import {RouterParamsHelper} from '../../commons/router-params-helper';
import {RAMModelHelper} from '../../commons/ram-model-helper';
import {RAMRestService} from '../../services/ram-rest.service';

export abstract class AbstractPageComponent implements OnInit, OnDestroy {

    protected rteParamSub: Rx.Subscription;

    constructor(public route: ActivatedRoute,
                public router: Router,
                public modelHelper: RAMModelHelper,
                public rest: RAMRestService) {
    }

    public ngOnInit() {

        // subscribe to router params
        this.rteParamSub = RouterParamsHelper.params(this.route, this.router)
            .subscribe((params) => {
                this.onInit(params);
            });

    }

    public ngOnDestroy() {
        this.rteParamSub.unsubscribe();
        this.onDestroy();
    }

    /* tslint:disable:no-empty */
    public onInit(params: {path:Params, query:Params}) {
    }

    /* tslint:disable:no-empty */
    public onDestroy() {
    }

}