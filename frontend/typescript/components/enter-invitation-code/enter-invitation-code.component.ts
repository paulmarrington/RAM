import {OnInit, Component} from '@angular/core';
import {Validators, ControlGroup, FormBuilder, FORM_DIRECTIVES} from '@angular/common';
import {ROUTER_DIRECTIVES, RouteParams, Router} from '@angular/router-deprecated';

@Component({
    selector: 'enter-invitation-code',
    templateUrl: 'enter-invitation-code.component.html',
    directives: [FORM_DIRECTIVES,ROUTER_DIRECTIVES]
})
export class EnterInvitationCodeComponent implements OnInit {

    public form: ControlGroup;

    public code: string;

    public idValue: string;

    public data: { relationshipCode: string } = { relationshipCode: '' };

    constructor(private _fb: FormBuilder, private router: Router,
        private routeParams: RouteParams) {
    }

    public ngOnInit() {
        this.code = this.routeParams.get('invitationCode');
        this.idValue = this.routeParams.get('idValue');

        this.form = this._fb.group({
            'relationshipCode': [this.data.relationshipCode,
                Validators.compose([Validators.required])]
        });

    }

    public activateCode() {
        this.router.navigate(['AcceptAuthorisationComponent', {
            idValue: this.idValue,
            invitationCode: this.data.relationshipCode
        }]);
    }

    public goToRelationshipsPage = () => {
        this.router.navigate(['Relationships', { idValue: this.idValue }]);
    };

}
