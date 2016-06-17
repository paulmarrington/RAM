import {RAMNgValidators} from '../../commons/ram-ng-validators';
import {OnInit, Component} from '@angular/core';
import {Validators, ControlGroup, FormBuilder, FORM_DIRECTIVES} from '@angular/common';
import {ROUTER_DIRECTIVES, RouteParams} from '@angular/router-deprecated';

@Component({
    selector: 'add-relationship-complete',
    templateUrl: 'add-relationship-complete.component.html',
    directives: [ROUTER_DIRECTIVES,FORM_DIRECTIVES],
    providers: []
})
export class AddRelationshipCompleteComponent implements OnInit {

    public form: ControlGroup;

    public code: string;

    public idValue: string;

    constructor(private _fb: FormBuilder, private routeParams: RouteParams) {
    }

    public ngOnInit() {
        this.code = this.routeParams.get('invitationCode');
        this.idValue = this.routeParams.get('idValue');

        this.form = this._fb.group({
            'email': ['', Validators.compose([RAMNgValidators.validateEmailFormat])],
            'udn': ['', Validators.compose([RAMNgValidators.validateUDNFormat])]
        });

    }
}
