import {RAMNgValidators} from '../../commons/ram-ng-validators';
import {OnInit, Component} from '@angular/core';
import {Validators, ControlGroup, FormBuilder, FORM_DIRECTIVES} from '@angular/common';
import {ROUTER_DIRECTIVES, RouteParams} from '@angular/router-deprecated';
import {RAMIdentityService} from '../../services/ram-identity.service';
import Rx from 'rxjs/Rx';
import {
    IName
} from '../../../../commons/RamAPI2';

@Component({
    selector: 'add-relationship-complete',
    templateUrl: 'add-relationship-complete.component.html',
    directives: [ROUTER_DIRECTIVES, FORM_DIRECTIVES],
    providers: []
})

export class AddRelationshipCompleteComponent implements OnInit {

    public form: ControlGroup;

    public code: string;

    public idValue: string;

    public displayName: string;

    // public identityDisplayName$: Rx.Observable<IName>;

    constructor(private _fb: FormBuilder, private _routeParams: RouteParams,
        private _identityService: RAMIdentityService) {
    }

    public ngOnInit() {
        this.code = this._routeParams.get('invitationCode');
        this.idValue = this._routeParams.get('idValue');
        this.displayName = this._routeParams.get('displayName');

        // this.identityDisplayName$ = this._identityService.getDefaultName(this.idValue).map(this.displayName);

        this.form = this._fb.group({
            'email': ['', Validators.compose([RAMNgValidators.validateEmailFormat])],
            'udn': ['', Validators.compose([RAMNgValidators.validateUDNFormat])]
        });

    }

}
