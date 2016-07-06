import {RAMNgValidators} from '../../commons/ram-ng-validators';
import {OnInit, Component} from '@angular/core';
import {Validators, ControlGroup, FormBuilder, FORM_DIRECTIVES} from '@angular/common';
import {ROUTER_DIRECTIVES, ActivatedRoute, Router} from '@angular/router';
import {IIdentity, INotifyDelegateDTO} from '../../../../commons/RamAPI2';
import {RAMRestService} from '../../services/ram-rest.service';
import {PageHeaderComponent} from '../page-header/page-header.component';
import Rx from 'rxjs/Rx';

@Component({
    selector: 'add-relationship-complete',
    templateUrl: 'add-relationship-complete.component.html',
    directives: [PageHeaderComponent, ROUTER_DIRECTIVES, FORM_DIRECTIVES],
    providers: []
})

// todo display name shouldn't be sent through in the path, should be obtained from the details associated with the invitation code
export class AddRelationshipCompleteComponent implements OnInit {

    public form: ControlGroup;
    public formUdn: ControlGroup;

    public idValue: string;
    public code: string;
    public displayName: string;

    public identity$: Rx.Observable<IIdentity>;

    private rteParamSub: Rx.Subscription;

    constructor(private _fb: FormBuilder,
                private route: ActivatedRoute,
                private router: Router,
                private rest: RAMRestService) {
    }

    public ngOnInit() {
        this.rteParamSub = this.route.params.subscribe(params => {
            this.code = decodeURIComponent(params['invitationCode']);
            this.idValue = decodeURIComponent(params['idValue']);
            this.displayName = decodeURIComponent(params['displayName']);
            this.identity$ = this.rest.findIdentityByValue(this.idValue);
        });

        this.form = this._fb.group({
            'email': ['', Validators.compose([Validators.required, RAMNgValidators.validateEmailFormat])]
        });
        this.formUdn = this._fb.group({
            'udn': ['']
        });
        // 'udn': ['', Validators.compose([Validators.required, RAMNgValidators.validateUDNFormat])]
    }

    public ngOnDestroy() {
        this.rteParamSub.unsubscribe();
    }

    public onSubmitUdn() {
        // TODO notify delegate by udn not implemented
        alert('Not Implemented');
        return false;
    }

    public onSubmitEmail() {
        const notifyDelegateDTO: INotifyDelegateDTO = {
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
        this.router.navigate(['/relationships', encodeURIComponent(this.idValue)]);
    }
}
