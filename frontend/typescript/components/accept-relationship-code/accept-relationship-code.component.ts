import {RAMNgValidators} from '../../commons/ram-ng-validators';
import {OnInit, Component} from '@angular/core';
import {Validators, ControlGroup, FormBuilder, FORM_DIRECTIVES} from '@angular/common';
import {ROUTER_PROVIDERS, RouteData} from '@angular/router-deprecated';

@Component({
    selector: 'accept-relationship-code',
    templateUrl: 'accept-relationship-code.component.html',
    directives: [FORM_DIRECTIVES],
    providers: [ROUTER_PROVIDERS]
})
export class AcceptRelationshipCodeComponent implements OnInit {

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
