import {Component} from '@angular/core';

@Component({
    selector: 'add-relationship',
    templateUrl: 'add-relationship.component.html',
    directives: []
})
export class AddRelationshipComponent {
  public isIndividual        = false;
  public showForIndividual   = false;
  public showForOrganisation = false;
  public showSteps           = [true,true];

  private clearSteps(from:number, to:number) {
    for (let i = from; i <= to; i += 1) {
      this.showSteps[i] = false;
    }
  }

  private showStep(step:number) {
    this.showSteps[step] = true;
  }

  private setRelationshipType(isIndividual:boolean) {
    this.isIndividual = this.showForIndividual = isIndividual;
    this.showForOrganisation = !isIndividual;
    this.clearSteps(2, 5)
  }

  public setToIndividual() {
    this.setRelationshipType(true);
    this.showStep(2);
  }

  public setToOrganisation() {
    this.setRelationshipType(false);
  }
}