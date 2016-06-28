import {OnInit, Component,OnDestroy} from '@angular/core';
import {Validators, ControlGroup, FormBuilder, FORM_DIRECTIVES} from '@angular/common';
import {ActivatedRoute, Router,ROUTER_DIRECTIVES} from '@angular/router';
import Rx from 'rxjs/Rx';

@Component({
    selector: 'enter-invitation-code',
    templateUrl: 'enter-invitation-code.component.html',
    directives: [FORM_DIRECTIVES,ROUTER_DIRECTIVES]
})
export class EnterInvitationCodeComponent implements OnInit,OnDestroy {

    public form: ControlGroup;

    public idValue: string;

    private rteParamSub: Rx.Subscription;

    constructor(private _fb: FormBuilder, private router: Router,
        private route: ActivatedRoute) {
    }

    public ngOnInit() {
        this.rteParamSub = this.route.params.subscribe(params => {
        this.idValue = params['idValue'];
        });

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

    public ngOnDestroy() {
        this.rteParamSub.unsubscribe();
    }

}
