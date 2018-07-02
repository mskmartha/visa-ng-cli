import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RequestAccessComponent } from './requestAccess.component';
import {CustomMaterialModule} from '../material-module/material.module';
@NgModule({
    declarations: [RequestAccessComponent],
    imports: [
      RouterModule.forChild([
            {
                path: '',
                component: RequestAccessComponent,
                data: {
                    title: 'requestAccess'
                },
            }
        ]),
        CustomMaterialModule
    ],
    providers: [],

    bootstrap: [RequestAccessComponent]
})
export class RequestAccessModule { }
