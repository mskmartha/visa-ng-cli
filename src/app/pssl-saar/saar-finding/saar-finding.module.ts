/**
 * Created by smartha on 7/1/17.
 */
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { SaarFindingComponent } from './saar-finding.component';
import { PopoverModule } from 'ng2-bootstrap/popover';
import { ModalModule } from 'ng2-bootstrap/modal';
import { SaarWizardComponent } from '../saar-wizard/saarWizard.component';
import { SaarScopingComponent } from '../saar-scoping/saar-scoping.component';
import { GlobalSharedService } from '../../shared/shared.service';

@NgModule({
  declarations: [SaarFindingComponent, SaarWizardComponent, SaarScopingComponent],
  imports: [
    SharedModule,
    ModalModule.forRoot(),
    PopoverModule.forRoot(),
    RouterModule.forChild([
      {
        path: '',
        component: SaarFindingComponent,
        data: {
          title: 'SAAR-FINDING'
        },
      }
    ])
  ],
  providers: [GlobalSharedService],
  entryComponents: [SaarWizardComponent],
  bootstrap: [SaarFindingComponent]
})
export class SaarFindingModule { }