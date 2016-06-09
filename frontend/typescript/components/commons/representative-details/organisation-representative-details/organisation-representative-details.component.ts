import {OnInit, Input, Output, EventEmitter, Component} from '@angular/core';
import {ControlGroup, Control, FormBuilder, FORM_DIRECTIVES, Validators}
from '@angular/common';
import {RAMRestService} from '../../../../services/ram-rest.service';
import {RAMNgValidators} from '../../../../commons/ram-ng-validators';

@Component({
    selector: 'organisation-representative-details',
    templateUrl: 'organisation-representative-details.component.html',
    directives: [FORM_DIRECTIVES]
})
export class OrganisationRepresentativeDetailsComponent implements OnInit {

    public form: ControlGroup;

    public organisationName = '';

    public ABNNotValidMsg = 'ABN is not valid';

    @Input('data') public data: OrganisationRepresentativeDetailsComponentData;

    @Output('dataChange') public dataChanges = new EventEmitter<OrganisationRepresentativeDetailsComponentData>();

    @Output('validationErrors') public validationErrors = new EventEmitter<boolean>();

    constructor(private _fb: FormBuilder, private rest: RAMRestService) { }

    public ngOnInit() {
        this.form = this._fb.group({
            'abn': [this.data.abn, Validators.compose([
                Validators.required, RAMNgValidators.validateABNFormat])]
        });
        this.form.valueChanges.subscribe(
            (v: OrganisationRepresentativeDetailsComponentData) => {
                this.dataChanges.emit(v);
            });
    }

    // operator has pressed "Check ABN" button
    public validateOrganisationName(abn: string) {
        // Rip of to a server to get company name
        this.rest.getOrganisationNameFromABN(abn)
            .then((name: string) => {
                this.organisationName = name;
                this.validationErrors.emit(false);
            }).catch((err: string) => {
                this.validationErrors.emit(true);
                this.organisationName = this.ABNNotValidMsg;
            });
    }

    public clearOrganisationABN = () => {
        // All we need to do is clear controls to start again
        (this.form.controls['abn'] as Control).updateValue('');
        this.organisationName = '';
    }

    public isCompanyNameSet = () => {
        return this.organisationName !== '' && this.organisationName !== this.ABNNotValidMsg;
    }
}

export interface OrganisationRepresentativeDetailsComponentData {
    abn: string;
}