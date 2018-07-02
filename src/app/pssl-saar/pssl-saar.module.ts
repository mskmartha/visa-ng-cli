/**
 * Created by smartha on 7/1/17.
 */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { PSSLSaarComponent } from './pssl-saar.component';
import { PopoverModule } from 'ng2-bootstrap/popover';
import { ModalModule } from 'ng2-bootstrap/modal';
import { SaarWizardComponent } from './saar-wizard/saarWizard.component';
import { SaarMitigationWizardComponent } from './saar-wizard/saarMitigationWizard.component';
import { SaarFindingComponent } from './saar-finding/saar-finding.component';
import { SaarScopingComponent } from './saar-scoping/saar-scoping.component';
import { SaarScopingWizardComponent } from './saar-scoping/wizard/saarScoping-wizard.component';
import { ComingSoonTemplate } from '../shared/html-templates/comingsoon';
@NgModule({
  declarations: [
    PSSLSaarComponent, 
    SaarScopingWizardComponent, 
    SaarWizardComponent, 
    SaarFindingComponent, 
    SaarScopingComponent,
    ComingSoonTemplate,
    SaarMitigationWizardComponent
  ],
  imports: [
    SharedModule,
    ModalModule.forRoot(),
    PopoverModule.forRoot(),
    RouterModule.forChild([
      {
        path: '',
        component: PSSLSaarComponent,
        data: {
          title: 'PSSL-SAAR'
        },
      }
    ])
  ],schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  providers: [],
  entryComponents: [SaarWizardComponent, SaarScopingWizardComponent, SaarFindingComponent, SaarScopingComponent, SaarMitigationWizardComponent],
  bootstrap: [PSSLSaarComponent]
})
export class PSSLSaarModule { }