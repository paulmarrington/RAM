import Rx from 'rxjs/Rx';
import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES, ActivatedRoute, Router, Params} from '@angular/router';
import {Validators, REACTIVE_FORM_DIRECTIVES, FormBuilder, FormGroup, FORM_DIRECTIVES } from '@angular/forms';

import {AbstractPageComponent} from '../abstract-page/abstract-page.component';
import {PageHeaderComponent} from '../commons/page-header/page-header.component';
import {RAMRestService} from '../../services/ram-rest.service';
import {RAMModelHelper} from '../../commons/ram-model-helper';
import {RAMRouteHelper} from '../../commons/ram-route-helper';

import {IIdentity} from '../../../../commons/RamAPI2';

@Component({
    selector: 'enter-invitation-code',
    templateUrl: 'enter-invitation-code.component.html',
    directives: [REACTIVE_FORM_DIRECTIVES, FORM_DIRECTIVES, ROUTER_DIRECTIVES, PageHeaderComponent]
})

export class EnterInvitationCodeComponent extends AbstractPageComponent {

    public idValue: string;

    public identity$: Rx.Observable<IIdentity>;

    public form: FormGroup;

    constructor(route: ActivatedRoute,
                router: Router,
                rest: RAMRestService,
                modelHelper: RAMModelHelper,
                routeHelper: RAMRouteHelper,
                private _fb: FormBuilder) {
        super(route, router, rest, modelHelper, routeHelper);
    }

    public onInit(params: {path: Params, query: Params}) {

        // extract path and query parameters
        this.idValue = decodeURIComponent(params.path['idValue']);

        // identity in focus
        this.identity$ = this.rest.findIdentityByValue(this.idValue);

        // forms
        this.form = this._fb.group({
            'relationshipCode': ['', Validators.compose([Validators.required])]
        });

    }

    public activateCode(event: Event) {

        this.routeHelper.goToRelationshipAcceptPage(
            this.idValue,
            this.form.controls['relationshipCode'].value
        );

        event.stopPropagation();
        return false;

    }

    public goToRelationshipsPage() {
        this.routeHelper.goToRelationshipsPage(this.idValue);
    };

}
