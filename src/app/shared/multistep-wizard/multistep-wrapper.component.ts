import {Component, Compiler, ViewContainerRef, ViewChild, Input,
  EventEmitter, Output, OnChanges, AfterViewInit, OnDestroy,
  ComponentRef, ComponentFactoryResolver, ChangeDetectorRef} from '@angular/core';
// Helper component to add dynamic components
@Component({
  selector: 'app-dcl-wrapper',
  template: `<div #target>
    <app-dynamic-form [step]="step" [injectData]="injectData" (stepEvent)="submitQns($event)" (reloadEmit)="reloadQns($event)">
    </app-dynamic-form>
  </div>`
})
export class DclWrapperComponent implements OnChanges, AfterViewInit, OnDestroy {
  @ViewChild('target', {read: ViewContainerRef}) target;
  @Output() stepEvent = new EventEmitter();
  @Output() reloadEmit = new EventEmitter();
  @Input() step;
  @Input() injectData;
  cmpRef: ComponentRef<any>;
  private isViewInitialized = false;

  constructor(private componentFactoryResolver: ComponentFactoryResolver, private compiler: Compiler,
      private cdRef: ChangeDetectorRef) {}

  updateComponent() {
    // console.log("updateComponent", this.type)
    if (!this.isViewInitialized) {
      return;
    }
    if (this.cmpRef) {
      this.cmpRef.destroy();
    }

    const factory = this.componentFactoryResolver.resolveComponentFactory(this.step.type);
    this.cmpRef = this.target.createComponent(factory);
    // to access the created instance use
    // this.compRef.instance.someProperty = 'someValue';
    // this.compRef.instance.someOutput.subscribe(val => doSomething());
    this.cdRef.detectChanges();
  }

  ngOnChanges() {
    this.updateComponent();
  }

  ngAfterViewInit() {
    this.isViewInitialized = true;
    this.updateComponent();
  }

  ngOnDestroy() {
    if (this.cmpRef) {
      this.cmpRef.destroy();
    }
  }
  reloadQns(val) {
    this.reloadEmit.next(val);
  }
  submitQns(emitObj) {
    // console.log('gotostep', stepData);
    this.stepEvent.next(emitObj);
  }
}

// Dynamically added components
@Component({
  selector: 'app-step-wiz',
  // template: `<h2>step1</h2><input type="text" [(ngModel)]="type"/>`
  template: ``
})
export class StepWizComponent {
  // type = 'test';
}

