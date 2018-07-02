import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {CustomMaterialModule} from './material-module/material.module';
import { BreadcrumbsComponent } from './shared/breadcrumb.component';
import { NgcDropdownDirective, NgcDropdownToggleDirective } from './shared/ngc-dropdown.directive';
import { SearchTooglerDirective } from './shared/search.directive';

import 'hammerjs';
import { AppRoutingModule } from './app.routing';
// Layouts
import { FullLayoutComponent } from './layouts/full-layout.component';

import { SimpleLayoutComponent } from './layouts/simple-layout.component';

import { AppComponent } from './app.component';

import { AuthGuard } from './auth/auth.guard';
import { AuthService } from './auth/auth.service';
import { UserInfoService } from './userinfo.service';
import { JwtHelper } from 'angular2-jwt';
// modal dialog imports
import { CommonDialogComponent } from './shared/modal/dialog.component';
import { ControlFactoryDirective } from './shared/control-factory.directive';

// multistep wizard imports
import { StepWizComponent } from './shared/multistep-wizard/multistep-wrapper.component';

// http client
import { HttpClient } from './shared/http.client';

@NgModule({
  declarations: [
    AppComponent,
    FullLayoutComponent,
    SimpleLayoutComponent,
    BreadcrumbsComponent,
    NgcDropdownDirective,
    NgcDropdownToggleDirective,
    SearchTooglerDirective,
    CommonDialogComponent,
    ControlFactoryDirective,
    StepWizComponent
  ],
  imports: [
    BrowserAnimationsModule,
    CustomMaterialModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    ReactiveFormsModule,

  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    AuthGuard,
    AuthService,
    UserInfoService,
    HttpClient,
    JwtHelper
  ],
  entryComponents: [CommonDialogComponent, StepWizComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
