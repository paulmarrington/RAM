import {Component, OnInit, OnDestroy, Input} from '@angular/core';
//import {ActivatedRoute, Router} from '@angular/router';
//import {ROUTER_DIRECTIVES} from '@angular/router';
import Rx from 'rxjs/Rx';
import {RAMModelHelper} from '../../commons/ram-model-helper';
import {RAMRestService} from '../../services/ram-rest.service';
import {IIdentity} from '../../../../commons/RamAPI2';

@Component({
    selector: 'page-header',
    templateUrl: 'page-header.component.html',
    directives: []
})

export class PageHeaderComponent implements OnInit, OnDestroy {

    @Input() public identityObservable: Rx.Observable<IIdentity>;
    @Input() public tab: string;

    public identity: IIdentity;

    constructor(private modelHelper: RAMModelHelper) {
    }

    public ngOnInit() {
        this.identityObservable.subscribe((identity) => {
            this.identity = identity;
        });
    }

    public ngOnDestroy() {
    }

    public title(): string {
        return this.identity ? this.modelHelper.displayNameForIdentity(this.identity) : 'Loading ...';
    }

}