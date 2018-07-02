/**
 * Created by smartha on 6/4/17.
 */
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { PSSLLdrComponent } from './pssl-ldr.component';
import { PopoverModule } from 'ng2-bootstrap/popover';
import { ModalModule } from 'ng2-bootstrap/modal';
import { LDRWizardComponent } from './ldr-wizard/ldrWizard.component';
@NgModule({
  declarations: [PSSLLdrComponent, LDRWizardComponent],
  imports: [
    SharedModule,
    ModalModule.forRoot(),
    PopoverModule.forRoot(),
    RouterModule.forChild([
      {
        path: '',
        component: PSSLLdrComponent,
        data: {
          title: 'PSSL-LDR'
        },
      }
    ])
  ],
  providers: [],
  entryComponents: [LDRWizardComponent],
  bootstrap: [PSSLLdrComponent]
})
export class PSSLLdrModule { }
