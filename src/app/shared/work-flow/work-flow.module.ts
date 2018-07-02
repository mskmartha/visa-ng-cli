import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkFlowStepperComponent } from './work-flow-stepper.component';
import { WorkFlowComponent } from './work-flow.component';
import { WorkFlowBodyComponent } from './work-flow-body.component';
import { WorkFlowActionsComponent } from './work-flow-actions.component';

@NgModule({
  declarations: [
    WorkFlowStepperComponent,
    WorkFlowComponent,
    WorkFlowBodyComponent,
    WorkFlowActionsComponent
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    WorkFlowStepperComponent,
    WorkFlowComponent,
    WorkFlowBodyComponent,
    WorkFlowActionsComponent
  ],
  schemas: [ NO_ERRORS_SCHEMA ]
})
export class WorkFlowModule {
}
