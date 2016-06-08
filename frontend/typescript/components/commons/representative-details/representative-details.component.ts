import {OnInit, Input, Output, EventEmitter, Component} from '@angular/core';
import {ControlGroup, FormBuilder, FORM_DIRECTIVES} from '@angular/common';
import {
    IndividualRepresentativeDetailsComponent,
    IndividualRepresentativeDetailsComponentData} from
'./individual-representative-details/individual-representative-details.component';
import {
    OrganisationRepresentativeDetailsComponent,
    OrganisationRepresentativeDetailsComponentData} from
'./organisation-representative-details/organisation-representative-details.component';

@Component({
    selector: 'representative-details',
    templateUrl: 'representative-details.component.html',
    directives: [
        IndividualRepresentativeDetailsComponent,
        OrganisationRepresentativeDetailsComponent,
        FORM_DIRECTIVES
    ]
})

export class RepresentativeDetailsComponent implements OnInit {

    public form: ControlGroup;

    @Input('data') public data: RepresentativeDetailsComponentData;

    @Output('dataChange') public dataChanges = new EventEmitter<RepresentativeDetailsComponentData>();

    @Output('validationErrors') public validationErrors = new EventEmitter<boolean>();

    constructor(private _fb: FormBuilder) {}

    public ngOnInit() {
        this.form = this._fb.group({
            'repTypeOrganisation': [this.data.repTypeOrganisation],
            'repTypeIndividual':   [this.data.repTypeIndividual]
        });
        this.form.valueChanges.subscribe(
        (v: RepresentativeDetailsComponentData) => {
            this.dataChanges.emit(v);
            this.validationErrors.emit(this.form.valid);
        });
    }

    public isIndividual(): boolean {
        return this.data.repTypeIndividual.checked;
    }
    public isOrganisation(): boolean {
        return this.data.repTypeOrganisation.checked;
    }
}

export interface RepresentativeDetailsComponentData {
    repTypeOrganisation: {checked: boolean};
    repTypeIndividual:   {checked: boolean};
    individual:          IndividualRepresentativeDetailsComponentData;
    organisation:        OrganisationRepresentativeDetailsComponentData;
}
