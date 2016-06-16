import {OnInit, Component} from '@angular/core';
import {Validators, ControlGroup, FormBuilder, FORM_DIRECTIVES} from '@angular/common';
import {ROUTER_PROVIDERS, RouteData} from '@angular/router-deprecated';

@Component({
    selector: 'enter-invitation-code',
    templateUrl: 'enter-invitation-code.component.html',
    directives: [FORM_DIRECTIVES],
    providers: [ROUTER_PROVIDERS]
})
export class EnterInvitationCodeComponent implements OnInit {

    public form: ControlGroup;

    public data: { relationshipCode: string } = { relationshipCode: '' };

    constructor(private _fb: FormBuilder, private routeData: RouteData) {
    }

    public ngOnInit() {
        this.form = this._fb.group({
            'relationshipCode': [this.data.relationshipCode,
                Validators.compose([Validators.required])]
        });

    }
}
