import { Component, Input, OnInit } from '@angular/core';
import { WorkFlowStepperComponent } from './work-flow-stepper.component';
import { WorkFlowService } from './work-flow.service';

@Component({
  selector: 'app-work-flow',
  templateUrl: './work-flow.component.html'
})
export class WorkFlowComponent implements OnInit {
  private _isOpen = false;

  @Input()
  public label: string;

  @Input()
  public optional: string;


  @Input()
  set isOpen(value: boolean) {
    this._isOpen = value;
    if (value) {
      this.wrkFlwStepper.closeOthers(this);
    }
  }
  get isOpen() {
    return this._isOpen;
  }

  public stepNumber: number;
  public hasError: boolean;
  public message: string;
  public wrkFlwStepper: WorkFlowStepperComponent;
  constructor(private _wrkFlwService: WorkFlowService) {
    this._wrkFlwService.isInitWrkFlwStepperCmp.subscribe((stepper: WorkFlowStepperComponent) => {
      this.wrkFlwStepper = stepper;
    });
  }

  public ngOnInit(): void {
    this._wrkFlwService.isInitWrkFlwCmp.next(this);
  }

  public isActive(): boolean {
    return this.wrkFlwStepper ? this.wrkFlwStepper.isActiveStep(this) : false;
  }

  toggleOpen(stepNumber: number): void {
    if (!this.wrkFlwStepper.isEnabled(stepNumber)) {
      return;
    }
    event.preventDefault();
    this.isOpen = !this.isOpen;
  }
}
