import {OnInit, Input, Output, EventEmitter, Component} from '@angular/core';
import {ControlGroup, FormBuilder, FORM_DIRECTIVES} from '@angular/common';
import {RAMNgValidators} from   '../../../commons/ram-ng-validators';
import {MarkdownComponent} from '../ng2-markdown/ng2-markdown.component';

@Component({
    selector: 'declaration',
    templateUrl: 'declaration.component.html',
    directives: [FORM_DIRECTIVES, MarkdownComponent]
})
export class DeclarationComponent implements OnInit {

    @Input() public isAuthorizedBtnEnabled: boolean;

    @Input('data') public data: DeclarationComponentData;

    @Output('dataChange') public dataChanges = new EventEmitter<DeclarationComponentData>();

    @Output('isValid') public isValid = new EventEmitter<boolean>();
    @Output('backEvent') public backEvent = new EventEmitter<boolean>();
    @Output('createRelationshipEvent') public createRelationshipEvent = new EventEmitter<boolean>();

    public form: ControlGroup;

    constructor(private _fb: FormBuilder) {
    }

    public ngOnInit() {
        this.form = this._fb.group({
            'accepted': [false, RAMNgValidators.mustBeTrue]
        });

        this.form.valueChanges.subscribe((v: DeclarationComponentData) => {
            this.dataChanges.emit(v);
            this.isValid.emit(this.form.valid);
        });
    }

    public back() {
        this.backEvent.emit(true);
    }

    public createRelationship() {
        this.createRelationshipEvent.emit(true);
    }

}

export interface DeclarationComponentData {
    accepted: boolean;
}
