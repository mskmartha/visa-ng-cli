/**
 * Created by sangkuma on 6/7/17.
 */
import {Component, Input, EventEmitter, Output, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {MatCard} from '@angular/material';
import {PSSLCsWizardComponent} from './codescan-wizard/csWizard.component';
import { MatDialog } from '@angular/material';
import { PSSLCodeScanService } from './pssl-codescan.service';
import { GlobalSharedService } from '../shared/shared.service';
import 'rxjs/Rx';
import {PSSLCsGraphWizardComponent} from './codescan-graph/csGraphWizard.component';
import {DialogsService} from '../shared/modal/dialogs.service';
@Component({
    selector: 'app-pssl-codescan',
    templateUrl: './pssl-codescan.component.html',
    styleUrls: ['./pssl-codescan.component.css'],
    providers: [PSSLCodeScanService, DialogsService],
})
export class PSSLCodeScanComponent implements OnInit {
    @Output() tabStatusEvent = new EventEmitter();
    public csDetails: Array<any> = [];
    public records = false;
    @Input() valueToPass = 0;
    public params: any;
    public showDwnld = false;
    public showGenerate = false;
    subscription: any;
    psslData: any;

    public showProgess = true;
    public norecords = false;
    public recordsErr = false;
    public genReportSuccess = false;
    public errOnSubmit = false;
    public isReportGenerated = false;
  private hasPermission;
    constructor(private api: GlobalSharedService,
                private _routeParams: ActivatedRoute,
                private _psslCodeScanService: PSSLCodeScanService,
                private router: Router,
                public dialog: MatDialog,
                private dialogsService?: DialogsService ) {
        this.subscription    = this.api.getData('pssl').subscribe( _psslData => {
            this.psslData = _psslData;

        });
    }
    ngOnInit() {
      this.showDwnld = false;
      this.showGenerate = false;
      this.getCodeScanDetails();
    }
    getCodeScanDetails() {
        this.showProgess = true;
        this.recordsErr = false;
        this.records = false;
        this.norecords = false;
        this.genReportSuccess = false;
        this.errOnSubmit = false;
        this._psslCodeScanService.getCSDetails(this.psslData.id).subscribe((res) => {
            const headers = res.headers;
            const data = res.text().length > 0 ? res.json() : null;
            if (headers.get('x-permission') === '1') {
              this.hasPermission = true;
            }
            if (Array.isArray(data) && data.length > 0 ) {
                this.showProgess = false;
                this.records = true;
                for (const item of data) {
                  if (item.confirmedHigh > 0 || item.confirmedMedium > 0 || item.confirmedLow > 0) {
                    this.showGenerate = true;
                    break;
                  }
                }
                if (this.isReportGenerated) {
                    this.showDwnld = true;
                    this.showGenerate = false;
                } else {
                    this.showDwnld = false;
                }
            } else {
                this.showProgess = false;
                this.records = false;
                this.showDwnld = false;
                this.norecords = true;
            }
            this.csDetails = data;
        }, err => {
            this.showProgess = false;
            this.recordsErr = true;
            this.records = false;
            this.showDwnld = false;
            this.norecords = false;
            this.showGenerate = false;
        });
    }
    openClassicDialog() {
      const dialogRef = this.dialog.open(PSSLCsWizardComponent, {
        data: {
            id: this.psslData.id
        }
      });
      dialogRef.disableClose = true;
      dialogRef.afterClosed().subscribe(result => {
        if (result !== 'cancel') {
          this.getCodeScanDetails();
        }

      });
    }
    openGraphDialog(scanId?: string, projectName?: string) {
      const dialogRef = this.dialog.open(PSSLCsGraphWizardComponent, {
        data: {
          scanId: scanId,
          projectName: projectName
        }
      });
    }
    genReport() {
        this.showProgess = true;
        this.records = false;
        this.showDwnld = false;
        this.showGenerate = true;
        this._psslCodeScanService.genCSReport(this.psslData.id).subscribe(res => {
            this.showProgess = false;
            this.showDwnld = true;
            this.showGenerate = true;
            this.genReportSuccess = true;
            this.isReportGenerated = true;
            this.tabStatusEvent.next(2);
        }, err => {
            this.showProgess = false;
            this.showDwnld = false;
            this.errOnSubmit = true;
            this.showGenerate = false;
        });
    }
    ConvertToCSV(objArray) {
            const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
            let str = '';
            let row = '';
            for (const index in objArray[0]) {
                // Now convert each value to string and comma-separated
                row += index + ',';
            }
            row = row.slice(0, -1);
            // append Label row with line break
            str += row + '\r\n';

            for (let i = 0; i < array.length; i++) {
                let line = '';
                for (const index in array[i]) {
                    if (line !== '') {
                      line += ','
                    }
                    line += array[i][index];
                }
                str += line + '\r\n';
            }
            return str;
        }

    dwldReport() {
        console.log('Inside Dwnld Report Function', this.psslData.id);
         this._psslCodeScanService.dwnlCSReport(this.psslData.id).subscribe((data) => {
             console.log('data in download>>>', data);
             const csvData = this.ConvertToCSV(data);
             const blob = new Blob([csvData], { type: 'text/csv' });
             const fileName = 'AssuranceReport.csv';
             if (navigator.appVersion.toString().indexOf('.NET') > 0) { // for IE
               window.navigator.msSaveOrOpenBlob(blob, fileName);
             } else { // for Non-IE (chrome, firefox etc.)
               let a = document.createElement("a");
               document.body.appendChild(a);
               a.setAttribute('style', 'display:none;');
               const csvUrl = URL.createObjectURL(blob);
               a.href =  csvUrl;
               a.download = fileName;
               a.click();
               a.remove();
             }
         }
        );
    }

  removeProject(projectId: number) {

    const modalConfig: any = {
      disableClose: false,
      width: '400px',
      height: '',
      data: {
        showCancelBttn: false,
        showTitle: true,
        dynComps: [ // required
          {
            data: {
              message: 'Are you sure you want to delete ?',
            },
            compName: 'confirm-delete'
          }
        ]
      }
    };
    this.dialogsService
      .openDialog('Delete Confirmation', 'Are you sure to proceed delete ?', modalConfig)
      .subscribe(res => {
        const resultFromModal: any = res;
        if (resultFromModal === 'confirm') {
          this._psslCodeScanService.removeProject(projectId).subscribe((data) => {
            console.log(data);
            //this.loadSast();
          });
        }
      });
  }
}
