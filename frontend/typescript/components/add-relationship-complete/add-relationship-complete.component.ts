import {RAMNgValidators} from '../../commons/ram-ng-validators';
import {OnInit, Component} from '@angular/core';
import {Validators, ControlGroup, FormBuilder, FORM_DIRECTIVES} from '@angular/common';
import {ROUTER_DIRECTIVES, RouteParams, Router} from '@angular/router-deprecated';
import {
    INotifyDelegateDTO
} from '../../../../commons/RamAPI2';
import {RAMRestService} from '../../services/ram-rest.service';

@Component({
    selector: 'add-relationship-complete',
    templateUrl: 'add-relationship-complete.component.html',
    directives: [ROUTER_DIRECTIVES, FORM_DIRECTIVES],
    providers: []
})

// todo display name shouldn't be sent through in the path, should be obtained from the details associated with the invitation code
export class AddRelationshipCompleteComponent implements OnInit {

    public form:ControlGroup;
    public formUdn:ControlGroup;

    public code:string;

    public idValue:string;

    public displayName:string;

    constructor(private _fb:FormBuilder,
                private _routeParams:RouteParams,
                private router:Router,
                private rest:RAMRestService) {
    }

    public ngOnInit() {
        this.code = decodeURIComponent(this._routeParams.get('invitationCode'));
        this.idValue = decodeURIComponent(this._routeParams.get('idValue'));
        this.displayName = decodeURIComponent(this._routeParams.get('displayName'));

        this.form = this._fb.group({
            'email': ['', Validators.compose([Validators.required, RAMNgValidators.validateEmailFormat])]
        });
        this.formUdn = this._fb.group({
            'udn': ['']
        });
        // 'udn': ['', Validators.compose([Validators.required, RAMNgValidators.validateUDNFormat])]
    }

    public onSubmitUdn() {
        // TODO notify delegate by udn not implemented
        alert('Not Implemented');
        return false;
    }

    public onSubmitEmail() {
        const notifyDelegateDTO:INotifyDelegateDTO = {
            email: this.form.value.email
        };

        this.rest.notifyDelegateByInvitationCode(this.code, notifyDelegateDTO).subscribe((relationship) => {
            // TODO a more suitable confirmation is probably desirable
            alert('Delegate Notification Sent');
            this.goToRelationshipsPage();
        }, (err) => {
            // TODO
            alert(JSON.stringify(err, null, 2));
        });
        return false;
    };

    public goToRelationshipsPage = () => {
        this.router.navigate(['Relationships', {idValue: this.idValue}]);
    }
}
