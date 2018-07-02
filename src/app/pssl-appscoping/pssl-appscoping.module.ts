/**
 * Created by smartha on 6/4/17.
 */
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { PSSLAppScopeComponent } from './pssl-appscoping.component';
import { PopoverModule } from 'ng2-bootstrap/popover';
import { ModalModule } from 'ng2-bootstrap/modal';
import { GlobalSharedService } from '../shared/shared.service';
@NgModule({
  declarations: [PSSLAppScopeComponent],
  imports: [
    SharedModule,
    ModalModule.forRoot(),
    PopoverModule.forRoot(),
    RouterModule.forChild([
      {
        path: '',
        component: PSSLAppScopeComponent,
        data: {
          title: 'PSSL-App Scoping'
        },
      }
    ])
  ],
  providers: [GlobalSharedService],
  entryComponents: [],
  bootstrap: [PSSLAppScopeComponent]
})
export class PSSLLdrModule { }
