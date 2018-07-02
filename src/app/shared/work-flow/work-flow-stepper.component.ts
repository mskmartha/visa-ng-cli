import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation, ElementRef} from '@angular/core';
import { WorkFlowOptions } from './work-flow.model';
import { WorkFlowComponent } from './work-flow.component';
import { WorkFlowService } from './work-flow.service';

@Component({
  selector: 'app-work-flow-stepper',
  templateUrl: './work-flow-stepper.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./work-flow.style.scss'],
  exportAs: 'stepper',
  providers: [WorkFlowService]
})
export class WorkFlowStepperComponent implements OnInit {
  @Input()
  public options: WorkFlowOptions = {
    mobileStepText: true,
    linear: true,
    vertical: false,
    alternative: true,
    labelStep: 'Step',
    labelOf: 'of',
    enableSvgIcon: false,
    wrkFlwSteps: [],
    enabaled: []
  };
  @Output() emitCurrentStepEvent = new EventEmitter();
  public steps: WorkFlowComponent[] = [];
  public currentStep = 0;

  public hasFeedback: boolean;
  public feedbackMessage: string;
  ele;
  constructor(private _wrkFlwStepperService: WorkFlowService, _ele: ElementRef) {
    this._wrkFlwStepperService.isInitWrkFlwCmp.subscribe((step: WorkFlowComponent) => {
      step.stepNumber = this.addStep(step);
    });
    this.ele = _ele;
  }

  public ngOnInit(): void {
    if (this.options.mobileStepText === undefined) {
      this.options.mobileStepText = true;
    }
    if (this.options.linear === undefined) {
      this.options.linear = true;
    }
    if (this.options.alternative === undefined) {
      this.options.alternative = true;
    }
    this._wrkFlwStepperService.isInitWrkFlwStepperCmp.next(this);
  }

  /**
   * Register component step to this stepper.
   *
   * @param {StepCtrl} step The step to add.
   * @returns number - The step number.
   */
  public addStep(step: WorkFlowComponent) {
    return this.steps.push(step) - 1;
  }

  /**
   * Complete the current step and move one to the next.
   * Using this method on editable steps (in linear stepper)
   * it will search by the next step without "completed" state to move.
   * When invoked it dispatch the event onstepcomplete to the step element.
   *
   * @returns boolean - True if move and false if not move (e.g. On the last step)
   */
  public next() {
    if (this.currentStep < this.steps.length) {
      this.clearError();
      this.currentStep++;
      this.toggleOpen(this.currentStep);
      this.clearFeedback();
      return true;
    }
    return false;
  }

  /**
   * Move to the previous step without change the state of current step.
   * Using this method in linear stepper it will check if previous step is editable to move.
   *
   * @returns boolean - True if move and false if not move (e.g. On the first step)
   */
  public back() {
    if (this.currentStep > 0) {
      this.clearError();
      this.currentStep--;
      this.toggleOpen(this.currentStep);
      this.clearFeedback();
      return true;
    }
    return false;
  }

  /**
   * Move to the next step without change the state of current step.
   * This method works only in optional steps.
   *
   * @returns boolean - True if move and false if not move (e.g. On non-optional step)
   */
  public skip() {
    const step = this.steps[this.currentStep];
    if (!step) {
      return;
    }
    if (step.optional) {
      this.currentStep++;
      this.clearFeedback();
      return true;
    }
    return false;
  }


  /**
   * Defines the current step state to "error" and shows the message parameter on
   * title message element.When invoked it dispatch the event onsteperror to the step element.
   *
   * @param {string} message The error message
   */
  public error(message: string) {
    const step = this.steps[this.currentStep];
    if (!step) {
      return;
    }
    step.hasError = true;
    step.message = message;
    this.clearFeedback();
  }

  /**
   * Defines the current step state to "normal" and removes the message parameter on
   * title message element.
   */
  public clearError() {
    const step = this.steps[this.currentStep];
    if (!step) {
      return;
    }
    step.hasError = false;
  }

  /**
   * Move "active" to specified step id parameter.
   * The id used as reference is the integer number shown on the label of each step (e.g. 2).
   *
   * @param {number} stepNumber (description)
   * @returns boolean - True if move and false if not move (e.g. On id not found)
   */
  public goto(stepNumber: number) {
    if (stepNumber < this.steps.length) {
      this.currentStep = stepNumber;
      this.clearFeedback();
      this.emitCurrentStepEvent.next(stepNumber);
      return true;
    }
    return false;
  }

  /**
   * Shows a feedback message and a loading indicador.
   *
   * @param {string} [message] The feedbackMessage
   */
  public showFeedback(message?: string) {
    this.hasFeedback = true;
    this.feedbackMessage = message;
  }

  /**
   * Removes the feedback.
   */
  public clearFeedback() {
    this.hasFeedback = false;
  }

  public isCompleted(stepNumber: number) {
    return this.options.wrkFlwSteps[stepNumber] === 5;
    // return this.options.linear && stepNumber < this.currentStep;
  };

  public isInProgress(stepNumber: number) {
    return this.options.wrkFlwSteps[stepNumber] === 3;
    // return this.options.linear && stepNumber < this.currentStep;
  };

  public isNotStarted(stepNumber: number) {
    return this.options.wrkFlwSteps[stepNumber] === 10;
    // return this.options.linear && stepNumber < this.currentStep;
  };

  public isEnabled(stepNumber: number) {
    return this.options.enabaled[stepNumber];
    // return this.options.linear && stepNumber < this.currentStep;
  };

  public isActiveStep(step: WorkFlowComponent): boolean {
    return this.steps.indexOf(step) === this.currentStep;
  }

  public closeOthers(openGroup: WorkFlowComponent): void {
    this.steps.forEach((step: WorkFlowComponent) => {
      if (step !== openGroup) {
        step.isOpen = false;
      }
    });
  }

  public toggleOpen(stepNumber: number): void {
    this.ele.nativeElement.scrollIntoView(true);
    this.steps.forEach((step: WorkFlowComponent) => {
      if (step.stepNumber === stepNumber) {
        step.isOpen = true;
      } else {
        step.isOpen = false;
      }
    });
  }
}
