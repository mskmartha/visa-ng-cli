/**
 * Created by sangkuma on 7/1/17.
 */
import { Routes, RouterModule } from '@angular/router';
import { PSSLSaarComponent } from './pssl-saar.component';

export const pSSLSaarRoutes: Routes = [
{
    path: '',
    redirectTo: 'pssl-saar',
    pathMatch: 'full',
  },
  {
    path: '',
    component: PSSLSaarComponent,
    data: {
      title: 'Security Assessment - SAAR'
    }, children: [
      {
        path: 'saar-finding',
        loadChildren: './pssl-saar/saar-finding.module#SaarFindingModule'
      },
      {
        path: 'saar-scoping',
        loadChildren: './pssl-saar/saar-scoping.module#SaarScopingModule'
      }
    ]
  }
];
export const PSSLSaarRouting = RouterModule.forChild(pSSLSaarRoutes);