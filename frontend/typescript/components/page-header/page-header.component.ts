import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import {Router} from '@angular/router';
import Rx from 'rxjs/Rx';
import {RAMModelHelper} from '../../commons/ram-model-helper';
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

    constructor(private router: Router,
                private modelHelper: RAMModelHelper) {
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

    public goToRelationshipsPage = () => {
        this.router.navigate(['/relationships', encodeURIComponent(this.identity.idValue)]);
    };

    public goToGiveAuthorisationPage = () => {
        this.router.navigate(['/relationships/add', encodeURIComponent(this.identity.idValue)]);
    };

    public goToGetAuthorisationPage = () => {
        this.router.navigate(['/relationships/add/enter', encodeURIComponent(this.identity.idValue)]);
    };

}