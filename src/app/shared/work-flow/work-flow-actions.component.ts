import { Component } from '@angular/core';

@Component({
  selector: 'app-work-flow-actions',
  template: `
    <div class="mat-step-actions">
      <ng-content></ng-content>
    </div>
  `
})
export class WorkFlowActionsComponent {

}
