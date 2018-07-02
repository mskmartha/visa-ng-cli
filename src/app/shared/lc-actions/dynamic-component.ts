import {Component, Input, ViewContainerRef, ViewChild, ReflectiveInjector, ComponentFactoryResolver} from '@angular/core';
import {PSSLActionsComponent} from '../../pssl/pssl-actions.component';
import {KCCActionsComponent} from '../../kcc/kcc-actions.component';
import {CSAActionsComponent} from '../../csa/csa-actions.component';
import {CSATeamActionsComponent} from '../../csa/csa-summary/csa-team-actions.component';
import {ManageKCCActionsComponent} from '../../kcc/kcc-summary/manage-kcc-actions.component';
import {KCCPprPirComponent } from '../../kcc/kcc-summary/kcc-ppr-pir.component';
@Component({
  selector: 'dynamic-component',
  entryComponents: [PSSLActionsComponent, KCCActionsComponent, CSAActionsComponent, CSATeamActionsComponent, ManageKCCActionsComponent, KCCPprPirComponent], // Reference to the components must be here in order to dynamically create them
  template: `
    <div #dynamicComponentContainer></div>
  `,
})
export default class DynamicComponent {
  currentComponent = null;

  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef }) dynamicComponentContainer: ViewContainerRef;

  // component: Class for the component you want to create
  // inputs: An object with key/value pairs mapped to input name/input value
  @Input() set componentData(data: {component: any, inputs: any }) {
    if (!data) {
      return;
    }

    // Inputs need to be in the following format to be resolved properly
    let inputProviders = Object.keys(data.inputs).map((inputName) => {return {provide: inputName, useValue: data.inputs[inputName]};});
    let resolvedInputs = ReflectiveInjector.resolve(inputProviders);
    
    // We create an injector out of the data we want to pass down and this components injector
    let injector = ReflectiveInjector.fromResolvedProviders(resolvedInputs, this.dynamicComponentContainer.parentInjector);
    
    // We create a factory out of the component we want to create
    let factory = this.resolver.resolveComponentFactory(data.component);
    
    // We create the component using the factory and the injector
    let component = factory.create(injector);
    
    // We insert the component into the dom container
    this.dynamicComponentContainer.insert(component.hostView);
    
    // We can destroy the old component is we like by calling destroy
    if (this.currentComponent) {
      this.currentComponent.destroy();
    }
    
    this.currentComponent = component;
  }
  
  constructor(private resolver: ComponentFactoryResolver) {
    
  }
}
