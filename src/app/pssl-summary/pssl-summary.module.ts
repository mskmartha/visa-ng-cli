/**
 * Created by sangkuma on 5/23/17.
 */
import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import {PSSLSummaryRouting} from './pssl-summary.routing';
import { PSSLSummaryComponent } from './pssl-summary.component';
import { ModalModule } from 'ng2-bootstrap/modal';
import { PopoverModule } from 'ng2-bootstrap/popover';
import {PSSLCodeScanComponent} from '../pssl-codescan/pssl-codescan.component';
import {PSSLCodeScanRouting} from '../pssl-codescan/pssl-codescan.routing';
import {PSSLAppScopeComponent} from '../pssl-appscoping/pssl-appscoping.component';
import {PSSLLdrComponent} from '../pssl-ldr/pssl-ldr.component';
import { PSSLSaarComponent } from '../pssl-saar/pssl-saar.component';
import { PSSLCsWizardComponent } from '../pssl-codescan/codescan-wizard/csWizard.component';
import { LDRWizardComponent } from '../pssl-ldr/ldr-wizard/ldrWizard.component';
import { SaarWizardComponent } from '../pssl-saar/saar-wizard/saarWizard.component';
import { SaarMitigationWizardComponent } from '../pssl-saar/saar-wizard/saarMitigationWizard.component';
import {PSSLSummaryService} from './pssl-summary.service';
import { SaarFindingComponent } from '../pssl-saar/saar-finding/saar-finding.component';
import { SaarScopingComponent } from '../pssl-saar/saar-scoping/saar-scoping.component';
import { FeatreSrchJiraCompnt } from '../pssl-appscoping/feature-search-jira/feature-search-jira.component';
import { SaarScopingWizardComponent } from '../pssl-saar/saar-scoping/wizard/saarScoping-wizard.component';
import { PSSLCsGraphWizardComponent } from '../pssl-codescan/codescan-graph/csGraphWizard.component';
import { GlobalSharedService } from '../shared/shared.service';
import {CSAMainComponent} from '../csa/csa-main.component';
import { SAPenTestComponent } from '../sa-pentest/sa-pentest.component';
@NgModule({
    declarations: [
        PSSLSummaryComponent,
        SaarScopingComponent,
        SaarFindingComponent,
        PSSLCodeScanComponent,
        PSSLAppScopeComponent,
        PSSLLdrComponent,
        PSSLSaarComponent,
        PSSLCsWizardComponent,
        LDRWizardComponent,
        FeatreSrchJiraCompnt,
        SaarWizardComponent,
        SaarScopingWizardComponent,
        PSSLCsGraphWizardComponent,
        SaarMitigationWizardComponent,
        CSAMainComponent,
        SAPenTestComponent
        ],
    imports: [
        SharedModule,
        PSSLSummaryRouting,
        PSSLCodeScanRouting,
        CommonModule,
        ModalModule.forRoot(),
        PopoverModule.forRoot(),
    ],
    providers: [PSSLSummaryService, GlobalSharedService],
    entryComponents: [
      PSSLCsWizardComponent,
      LDRWizardComponent,
      SaarScopingWizardComponent,
      FeatreSrchJiraCompnt,
      SaarWizardComponent,
      PSSLCsGraphWizardComponent,
      SaarMitigationWizardComponent
    ],
    bootstrap: [PSSLSummaryComponent]
})
export class PSSLSummaryModule { }
