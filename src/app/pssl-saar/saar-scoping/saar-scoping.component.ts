//our root app component
import {Component, NgModule,Inject, ViewChild} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { GlobalSharedService } from '../../shared/shared.service';
import { SAARService } from '../pssl-saar.service';
import { SaarScopingWizardComponent } from './wizard/saarScoping-wizard.component';
import {DialogsService} from '../../shared/modal/dialogs.service';
@Component({
  selector : 'saar-scoping',
  templateUrl: './saar-scoping.component.html',
  styleUrls: ['../pssl-saar.component.css'],
  providers: [DialogsService]
})
export class SaarScopingComponent {
  questions: any[];
  subscription: any;
  psslData: any;
  public records = true;
  public norecords = false;
  public recordsErr = false;
  public stillloading = false;
  public saarSummaryDetails: Array<any> = [];
  public saarScopingLoaded = false;
  private hasPermission;
  private readOnly;
  constructor(private api: GlobalSharedService,
    private fb: FormBuilder,
    private _saarService: SAARService,
    public dialog: MatDialog,
    private dialogsService: DialogsService
  ) {
    this.subscription    = this.api.getData('pssl').subscribe( _psslData => {
        this.psslData = _psslData;
        console.log("pssl data", this.psslData)
    });
  }
  ngOnInit() {
    this.getSaarScopingReview();
  }
  getSaarScopingReview() {
    this.stillloading = true;
    this.records = false;
    this.norecords = false;
    this._saarService.saarsummary(this.psslData).subscribe((res) => {

      const headers = res.headers;
      const data = res.text().length > 0 ? res.json() : null;
      //this.hasPermission = this.utils.getHttpHeader(res, 'x-permission');
      console.log('x-permission', headers.get('x-permission'));
      if (headers.get('x-permission') === '1') {
        this.hasPermission = true;
      }
      if (headers.get('x-permission') === '2') {
        this.readOnly = true;
      }

      if(Array.isArray(data) && data.length > 0 ){
        this.stillloading = false;
        this.records = true;
        this.norecords = false;
        this.recordsErr = false;
      } else {
        this.stillloading = false;
        this.records = false;
        this.norecords = true;
        this.recordsErr = false;
      }
      this.saarSummaryDetails = data;
    },err => {
      this.stillloading = false;
      this.records = false;
      this.norecords = false;
      this.recordsErr = true;
    })
  }

  openClassicDialog() {

    // console.log(id);
    // modal window config
    const modalConfig: any = {
      disableClose: false,
      width: '80%',
      height: '',
      data: {
        message: 'test message',
        showCancelBttn: true,
        showTitle: true,
        dynComps: [ // required
            {
                data: {
                  id: this.psslData.id,
                  currentStatus: '',
                  applicationId: this.psslData.applicationId,
                  actionId: '', // actionId 0 for new SA
                  isViewDisabled: false,
                  formId: 'pssl-saar'
                },
                compName: 'pssl-saar'
            }
        ]
      }
    };
    // console.log("modalConfig",modalConfig)
    this.dialogsService
    .openDialog(this.psslData.saId + ' - SAAR Scoping Questionnaire', 'message to modal', modalConfig)
    .subscribe(res => {
      const resultFromModal: any = res;
      if (resultFromModal !== 'cancel') {
        this.getSaarScopingReview();
      }
      });
  }
}
