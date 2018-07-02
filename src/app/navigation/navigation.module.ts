import {NgModule, ModuleWithProviders} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NavigationService} from './navigation.service';
import {CustomMaterialModule} from '../material-module/material.module';

@NgModule({
  imports : [
    CommonModule,
    RouterModule,
    FormsModule,
    CustomMaterialModule
  ],
  declarations : [],
  exports : []
})
export class NavigationModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule : NavigationModule,
      providers : [
        NavigationService
      ]
    };
  }
}

