import { Routes, RouterModule } from '@angular/router';
import {PSSLSummaryComponent} from './pssl-summary.component';
import {PSSLAppScopeComponent } from '../pssl-appscoping/pssl-appscoping.component';
import { PSSLLdrComponent } from '../pssl-ldr/pssl-ldr.component';
import { PSSLSaarComponent } from '../pssl-saar/pssl-saar.component';
import { PSSLCodeScanComponent } from '../pssl-codescan/pssl-codescan.component';
import {CSAMainComponent} from '../csa/csa-main.component';
import {SAPenTestComponent} from '../sa-pentest/sa-pentest.component';
export const pSSLSummaryRoutes: Routes = [
  {
    path: '',
    component: PSSLSummaryComponent,
    data: {
      title: 'Engagements Summary'
    },
    /* TODO: make child routes dynamic, get path names from global enums or from local config */
    children: [

      {path: '', redirectTo: '3', pathMatch: 'full'},
      {path: '1', component: PSSLAppScopeComponent},
      {path: '3', component: PSSLSaarComponent},
      {path: '2', component: PSSLLdrComponent},
      {path: '4', component: PSSLCodeScanComponent},
      {path: '5', component: SAPenTestComponent},
      {path: '8', component: CSAMainComponent},
      {path: '9', component: CSAMainComponent},
      {path: '10', component: CSAMainComponent},
      {path: '11', component: CSAMainComponent},
      {path: '12', component: CSAMainComponent},
      {path: '13', component: CSAMainComponent},
      {path: '14', component: CSAMainComponent},
      {path: '15', component: CSAMainComponent},
      {path: '16', component: CSAMainComponent},
      {path: '17', component: CSAMainComponent},
      {path: '18', component: CSAMainComponent},
      {path: '19', component: CSAMainComponent}
    ]
  }
];

export const PSSLSummaryRouting = RouterModule.forChild(pSSLSummaryRoutes);
