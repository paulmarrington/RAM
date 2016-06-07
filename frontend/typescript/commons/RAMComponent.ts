import {OnInit, Input, Output, EventEmitter} from '@angular/core';
import { ControlGroup, FormBuilder } from '@angular/common';

/*
 * Superclass for Aungular components. You will need to provide a
 * ComponentData interface and a function that return the controls.
 * And just for luck, add the following constructor:
 * 
 *     constructor(_fb: FormBuilder) { super(_fb); };
 */
export class RAMComponent<ComponentData> implements OnInit {
    public form: ControlGroup;

    // Each component has a data object containing form field values
    @Input('data') public data: ComponentData;

    @Output('dataChange') public dataChanges = new
    EventEmitter<ComponentData>();

    @Output('validationErrors') public validationErrors = new EventEmitter<boolean>();

    // Don't forget constructor(_fb: FormBuilder) { super(_fb); }; in subclass
    constructor(protected _fb: FormBuilder) {}

    // Add your controls in the subclass.
    protected controls() { return {}; }

    public ngOnInit() {
        this.form = this._fb.group(this.controls());
        this.form.valueChanges.subscribe((v: ComponentData) => {
            this.dataChanges.emit(v);
            this.validationErrors.emit(this.form.valid);
        });
    }
}