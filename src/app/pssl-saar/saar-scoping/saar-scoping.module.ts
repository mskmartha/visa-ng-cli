/**
 * Created by smartha on 7/1/17.
 */
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { SaarScopingComponent } from './saar-scoping.component';
import { PopoverModule } from 'ng2-bootstrap/popover';
import { ModalModule } from 'ng2-bootstrap/modal';
import { SaarWizardComponent } from '../saar-wizard/saarWizard.component';
import { SaarFindingComponent } from '../saar-finding/saar-finding.component';
import { SaarScopingWizardComponent } from './wizard/saarScoping-wizard.component';

@NgModule({
  declarations: [SaarScopingComponent,SaarScopingWizardComponent, SaarWizardComponent, SaarFindingComponent],
  imports: [
    SharedModule,
    ModalModule.forRoot(),
    PopoverModule.forRoot(),
    RouterModule.forChild([
      {
        path: '',
        component: SaarScopingComponent,
        data: {
          title: 'SAAR-SCOPING'
        },
      }
    ])
  ],
  providers: [],
  entryComponents: [SaarWizardComponent, SaarScopingWizardComponent],
  bootstrap: [SaarScopingComponent]
})
export class SaarScopingModule { }