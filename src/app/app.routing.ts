import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Layouts
import { FullLayoutComponent } from './layouts/full-layout.component';
import {AuthGuard} from './auth/auth.guard';
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '',
    component: FullLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: './dashboard/dashboard.module#DashboardModule',
      },
      {
        path: 'requestAccess',
        loadChildren: './requestAccess/requestAccess.module#RequestAccessModule',
      },
      {
        path: 'SA',
        loadChildren: './pssl/pssl.module#PSSLModule'
      },
      {
        path: 'KCC',
        loadChildren: './kcc/kcc.module#KCCModule'
      },
      {
        path: 'TSR',
        loadChildren: './tsr/tsr.module#TSRModule'
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
