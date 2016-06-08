import {OnInit, Input, Output, EventEmitter, Component} from '@angular/core';
import {ControlGroup, Control, FormBuilder, FORM_DIRECTIVES, Validators}
from '@angular/common';
import {RAMRestService} from '../../../../services/ram-rest.service';

@Component({
    selector: 'organisation-representative-details',
    templateUrl: 'organisation-representative-details.component.html',
    directives:  [FORM_DIRECTIVES]
})
export class OrganisationRepresentativeDetailsComponent implements OnInit {

    public form: ControlGroup;

    @Input('data') public data: OrganisationRepresentativeDetailsComponentData;

    @Output('dataChange') public dataChanges = new EventEmitter<OrganisationRepresentativeDetailsComponentData>();

    constructor(private _fb: FormBuilder, private rest: RAMRestService) {}

    public ngOnInit() {
        this.form = this._fb.group({
            'abn':   [this.data.abn, Validators.compose([
                Validators.required, Validators.compose([this.validABN])
            ])],
            'name':  [this.data.name]
        }, {validator: Validators.compose([this.validate])});
        this.form.valueChanges.subscribe(
        (v: OrganisationRepresentativeDetailsComponentData) => {
            this.dataChanges.emit(v);
        });
    }

    private validate = (cg:ControlGroup) => {
        return this.validABN(cg.controls['abn'] as Control) ||
        this.validName(cg.controls['name'] as Control);
    }

    private validABN = (abn:Control) => {
        if (/^(\d *?){11}$/.test(abn.value)) {
            return null;
        } else {
            return {hasValidABN: {valid: false}};
        }
    }

    private validName = (name: Control) => {
        if (name.value.length > 0) {
            return null;
        } else {
            return {hasOrganisationName: {valid: false}};
        }
    };

    // If we have an organisation name, then it was validated
    public hasName(): boolean {
        return (this.data && this.data.name.length !== 0);
    }
    public hasABN(): boolean {
        // abn must be 11 digits with possible spaces between them
        return (this.data && /^(\d *?){11}$/.test(this.data.abn));
    }

    // operator has pressed "Check ABN" button
    public getOrganisationName() {
        const abn = this.data.abn;
        // Rip of to a server to get company name
        this.rest.getOrganisationNameFromABN(abn)
        .then((name:string)=>
            (this.form.controls['name'] as Control).updateValue(name))
        // TODO: change the error once we have message control on client
        .catch((err:string)=> alert(err));
    }

    public clearOrganisationType() {
        // All we need to do is clear controls to start again
        (this.form.controls['abn'] as Control).updateValue('');
        (this.form.controls['name'] as Control).updateValue('');
    }
}

export interface OrganisationRepresentativeDetailsComponentData {
    abn:    string;
    name:   string;
}