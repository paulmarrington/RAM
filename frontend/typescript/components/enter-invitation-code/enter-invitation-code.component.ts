import {OnInit, Component} from '@angular/core';
import {Validators, ControlGroup, FormBuilder, FORM_DIRECTIVES} from '@angular/common';
import {RouteParams, Router,ROUTER_DIRECTIVES} from '@angular/router-deprecated';

@Component({
    selector: 'enter-invitation-code',
    templateUrl: 'enter-invitation-code.component.html',
    directives: [FORM_DIRECTIVES,ROUTER_DIRECTIVES]
})
export class EnterInvitationCodeComponent implements OnInit {

    public form: ControlGroup;

    public idValue: string;

    constructor(private _fb: FormBuilder, private router: Router,
        private routeParams: RouteParams) {
    }

    public ngOnInit() {
        this.idValue = decodeURIComponent(this.routeParams.get('idValue'));
        this.form = this._fb.group({
            'relationshipCode': ['', Validators.compose([Validators.required])]
        });

    }

    public activateCode(event: Event) {

        this.router.navigate(['AcceptAuthorisationComponent', {
            idValue: this.idValue,
            invitationCode: this.form.controls['relationshipCode'].value
        }]);

        event.stopPropagation();
        return false;
    }

}
