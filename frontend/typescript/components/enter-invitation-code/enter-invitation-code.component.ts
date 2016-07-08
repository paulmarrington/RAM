import {OnInit, Component, OnDestroy} from '@angular/core';
import {Validators, REACTIVE_FORM_DIRECTIVES, FormBuilder, FormGroup, FORM_DIRECTIVES } from '@angular/forms';
import {ActivatedRoute, Router, ROUTER_DIRECTIVES} from '@angular/router';
import Rx from 'rxjs/Rx';
import {PageHeaderComponent} from '../page-header/page-header.component';
import {IIdentity} from '../../../../commons/RamAPI2';
import {RAMRestService} from '../../services/ram-rest.service';

@Component({
    selector: 'enter-invitation-code',
    templateUrl: 'enter-invitation-code.component.html',
    directives: [REACTIVE_FORM_DIRECTIVES,FORM_DIRECTIVES, ROUTER_DIRECTIVES, PageHeaderComponent]
})
export class EnterInvitationCodeComponent implements OnInit, OnDestroy {

    public form: FormGroup;

    public idValue: string;

    public identity$: Rx.Observable<IIdentity>;

    private rteParamSub: Rx.Subscription;

    constructor(private _fb: FormBuilder,
                private router: Router,
                private route: ActivatedRoute,
                private rest: RAMRestService) {
    }

    public ngOnInit() {
        this.rteParamSub = this.route.params.subscribe(params => {
            this.idValue = decodeURIComponent(params['idValue']);
            this.identity$ = this.rest.findIdentityByValue(this.idValue);
        });
        this.form = this._fb.group({
            'relationshipCode': ['', Validators.compose([Validators.required])]
        });
    }

    public activateCode(event: Event) {

        this.router.navigate(['/relationships/add/accept',
            encodeURIComponent(this.idValue),
            this.form.controls['relationshipCode'].value
        ]);

        event.stopPropagation();
        return false;
    }

    public goToRelationshipsPage = () => {
        this.router.navigate(['/relationships', encodeURIComponent(this.idValue)]);
    };

    public ngOnDestroy() {
        this.rteParamSub.unsubscribe();
    }

}
