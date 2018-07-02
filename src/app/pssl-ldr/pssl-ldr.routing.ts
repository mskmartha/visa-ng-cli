/**
 * Created by sangkuma on 6/1/17.
 */
import { Routes, RouterModule } from '@angular/router';
import { PSSLLdrComponent } from './pssl-ldr.component';

export const pSSLLdrRoutes: Routes = [
  {
    path: '',
    component: PSSLLdrComponent,
    data: {title: 'Security Assessment - LDR'}
  }
];

export const PSSLLdrRouting = RouterModule.forChild(pSSLLdrRoutes);
