import {
  Directive,
  NgModule,
  Component,
  ComponentFactory,
  OnChanges,
  OnDestroy,
  Input,
  ViewContainerRef,
  Compiler,
  ComponentFactoryResolver, Output, EventEmitter
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { KCCWizardComponent } from '../kcc/wizard/wizard.component';
import { PSSLWizardComponent } from '../pssl/wizard/wizard.component';
import { PSSLActionsComponent } from '../pssl/pssl-actions.component';
import { CSAWizardComponent } from '../csa/wizard/wizard.component';
import { ChatWrapperComponent } from './chat-wizard/chat-wrapper.component';
import { SaarScopingWizardComponent } from '../pssl-saar/saar-scoping/wizard/saarScoping-wizard.component';
import { ShowMoreComponent } from './html-templates/showMore';
import { ShowAllCamrsComponent } from '../pssl/showAllCamrs.component';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { ConfirmDeleteComponent } from './html-templates/confirm-delete';
const typeMap = {
  'kcc': KCCWizardComponent,
  'pssl': PSSLWizardComponent,
  'csa': CSAWizardComponent,
  'chat': ChatWrapperComponent,
  'sa-actions': PSSLActionsComponent,
  'pssl-saar': SaarScopingWizardComponent,
  'showMore': ShowMoreComponent,
  'showAllCamrs': ShowAllCamrsComponent,
  'confirm-delete': ConfirmDeleteComponent
};

@Directive({
  selector: '[appCtrlFactory]'
})
export class ControlFactoryDirective implements OnChanges, OnDestroy {
  @Input() model: any;
  componentRef;
  init = false;
  @Output() closeEvent = new BehaviorSubject('cancel');
  constructor(
    private vcRef: ViewContainerRef,
    private resolver: ComponentFactoryResolver) { }

  create(comp) {
    const factory = this.resolver.resolveComponentFactory(comp);
    const compRef = this.vcRef.createComponent(factory);

    (<any>compRef).instance.model = this.model;

    if (this.componentRef) {
      this.componentRef.destroy();
    }

    this.componentRef = compRef;
    if(this.componentRef.instance.closeModalEvent) {
      // AB: Subscribing to the closeModalEvent which is part of the dynamically generated component to get the latest value of the closeEvent
      this.componentRef.instance.closeModalEvent.subscribe((val) => {
        this.closeEvent.next(val);
      });
    }
    this.init = true;
  }

  ngOnChanges() {
    if (!this.model || this.init) {return; }
    const comp = typeMap[this.model.compName];
    if (comp) {
      this.create(comp);
    }
  }
  public ngOnDestroy() {
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = null;
    }
  }
}
