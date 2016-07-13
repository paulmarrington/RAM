import {Component, Input} from '@angular/core';
import {Router} from '@angular/router';

import {RAMModelHelper} from '../../../commons/ram-model-helper';
import {RAMRouteHelper} from '../../../commons/ram-route-helper';

import {IIdentity} from '../../../../../commons/RamAPI2';

@Component({
    selector: 'page-header',
    templateUrl: 'page-header.component.html',
    directives: []
})

export class PageHeaderComponent {

    @Input() public identity: IIdentity;
    @Input() public tab: string;
    @Input() public messages: string[];

    constructor(private router: Router,
                private modelHelper: RAMModelHelper,
                private routeHelper: RAMRouteHelper) {
    }

    public hasMessages(): boolean {
        return this.messages && this.messages.length > 0;
    }

    public title(): string {
        return this.identity ? this.modelHelper.displayNameForIdentity(this.identity) : 'Loading ...';
    }

    public goToRelationshipsPage = () => {
        if (this.identity) {
            this.routeHelper.goToRelationshipsPage(this.identity.idValue);
        }
    };

    public goToGiveAuthorisationPage = () => {
        if (this.identity) {
            this.routeHelper.goToRelationshipAddPage(this.identity.idValue);
        }
    };

    public goToGetAuthorisationPage = () => {
        if (this.identity) {
            this.routeHelper.goToRelationshipEnterCodePage(this.identity.idValue);
        }
    };

}