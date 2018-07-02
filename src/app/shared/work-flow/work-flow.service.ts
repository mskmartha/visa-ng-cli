import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { WorkFlowComponent } from './work-flow.component';
import { WorkFlowStepperComponent } from './work-flow-stepper.component';

@Injectable()
export class WorkFlowService {
  public isInitWrkFlwStepperCmp = new Subject<WorkFlowStepperComponent>();
  public isInitWrkFlwCmp = new Subject<WorkFlowComponent>();
}
