import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, RequestOptions } from '@angular/http';
import { CommonModule } from '@angular/common';
import { JsonpModule } from '@angular/http';
import { DclWrapperComponent } from './multistep-wizard/multistep-wrapper.component';
import { DynamicFormComponent } from './multistep-wizard/dynamic-form.component';
import { KCCWizardComponent } from '../kcc/wizard/wizard.component';
import { PSSLWizardComponent } from '../pssl/wizard/wizard.component';
import { CSAWizardComponent } from '../csa/wizard/wizard.component';
import { FromNowPipe } from './pipes/from-now.pipe';
import { ChatComponent } from './chat-wizard/chat.component';
import { MultiStepWizardComponent } from './multistep-wizard/multistep-wizard.component';
import { ChatWrapperComponent } from './chat-wizard/chat-wrapper.component';
import { ChatComponentService } from './chat-wizard/chat.component.service';
import DynamicComponent from '../shared/lc-actions/dynamic-component';
import GenericStatesLegendComponent from '../shared/genericLegend/legend-component';
import {PSSLActionsComponent} from '../pssl/pssl-actions.component';
import {KCCActionsComponent} from '../kcc/kcc-actions.component';
import {CSAActionsComponent} from '../csa/csa-actions.component';
import {CSATeamActionsComponent} from '../csa/csa-summary/csa-team-actions.component';
import {CSATeamComponent} from '../csa/csa-summary/csa-team.component';
import {ManageKCCActionsComponent} from '../kcc/kcc-summary/manage-kcc-actions.component';
import {KCCPprPirComponent } from '../kcc/kcc-summary/kcc-ppr-pir.component';
import {DynMenuComponent} from '../shared/dyn-menu/dyn-menu.component';
import {EditableTableComponent} from '../shared/editable-table/editable-table.component';
import { ShowMoreComponent } from './html-templates/showMore';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import {CustomMaterialModule} from '../material-module/material.module';
import { WorkFlowModule } from './work-flow/work-flow.module';
import { ConfirmDeleteComponent } from './html-templates/confirm-delete';
import {SnackBarSuccessComponent, SnackBarErrorComponent} from './html-templates/snack-bar.component';
import { CvaDateComponent } from '../shared/cva-date.component';
import {FileUploadComponent} from './upload/file-upload/file-upload.component';
import {FileDownloadComponent} from './upload/file-download/file-download.component';
import {UploadFileService} from './upload/upload-file.service';
import {CustomMatCardComponent} from './custom-mat-card/custom-mat-card.component';
import { AutocompleMultiSelComponent } from '../shared/autocomplete-multi-select/autocomplete-multi-select.component';
import { MultiRowQuestionComponent } from './multi-row-question/multi-row-question.component';
import { CommentsComponent } from './comments/comments.component';
import { ComingSoonTemplate } from '../shared/html-templates/comingsoon';
import {NavBarPaginationComponent} from './nav-bar-pagination';
@NgModule({
  imports: [
    HttpModule,
    CommonModule,
    FormsModule,
    JsonpModule,
    ReactiveFormsModule,
    CustomMaterialModule,
    ChartsModule,
    WorkFlowModule
  ],
  declarations: [
    DclWrapperComponent,
    PSSLActionsComponent,
    KCCActionsComponent,
    CSAActionsComponent,
    CSATeamActionsComponent,
    ManageKCCActionsComponent,
    KCCPprPirComponent,
    DynamicFormComponent,
    KCCWizardComponent,
    PSSLWizardComponent,
    CSAWizardComponent,
    ChatWrapperComponent,
    FromNowPipe,
    ChatComponent,
    MultiStepWizardComponent,
    DynamicComponent,
    DynMenuComponent,
    EditableTableComponent,
    GenericStatesLegendComponent,
    ShowMoreComponent,
    ConfirmDeleteComponent,
    CSATeamComponent,
    SnackBarSuccessComponent,
    CustomMatCardComponent,
    SnackBarErrorComponent,
    CvaDateComponent,
    FileUploadComponent,
    FileDownloadComponent,
    AutocompleMultiSelComponent,
    MultiRowQuestionComponent,
    CommentsComponent,
    MultiRowQuestionComponent,
    ComingSoonTemplate,
    NavBarPaginationComponent
  ],
  providers: [ChatComponentService, UploadFileService],
  exports: [
    MultiStepWizardComponent,
    DynamicComponent,
    DynMenuComponent,
    EditableTableComponent,
    CustomMatCardComponent,
    GenericStatesLegendComponent,
    HttpModule,
    CommonModule,
    FormsModule,
    JsonpModule,
    ReactiveFormsModule,
    CustomMaterialModule,
    WorkFlowModule,
    FileUploadComponent,
    FileDownloadComponent,
    ChartsModule,
    ComingSoonTemplate,
    NavBarPaginationComponent
  ],
  entryComponents: [
    KCCWizardComponent,
    PSSLWizardComponent,
    CSAWizardComponent,
    ChatWrapperComponent,
    ShowMoreComponent,
    ConfirmDeleteComponent,
    CSATeamComponent,
    SnackBarSuccessComponent,
    SnackBarErrorComponent,
    CvaDateComponent,
    AutocompleMultiSelComponent,
    ComingSoonTemplate,
    NavBarPaginationComponent
  ],
})
export class SharedModule {
}
