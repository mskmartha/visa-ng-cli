/**
 * Created by sangkuma on 6/1/17.
 */
import { Routes, RouterModule } from '@angular/router';
import { PSSLAppScopeComponent } from './pssl-appscoping.component';

export const pSSLLdrRoutes: Routes = [
  {
    path: '',
    component: PSSLAppScopeComponent,
    data: {title: 'Security Assessment - App Scoping'}
  }
];

export const PSSLLdrRouting = RouterModule.forChild(pSSLLdrRoutes);
