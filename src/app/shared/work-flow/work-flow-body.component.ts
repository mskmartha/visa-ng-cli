import { Component } from '@angular/core';

@Component({
  selector: 'app-work-flow-body',
  template: `
    <div class="mat-step-body">
      <ng-content></ng-content>
    </div>
  `
})
export class WorkFlowBodyComponent {

}
