import {Component, OnInit, Input, Output, EventEmitter  } from '@angular/core';
import { TableDataSource } from './table-data-source';
import { TableValidatorService } from '../form-controls/editable-table-validator.service';
import { HttpClient } from '../http.client';
import {DialogsService} from '../modal/dialogs.service';
import {MatSnackBar} from '@angular/material';
import {SnackBarErrorComponent, SnackBarSuccessComponent} from '../../shared/html-templates/snack-bar.component';
@Component({
  selector: 'app-editable-table',
  templateUrl: './editable-table.component.html',
  styles: [`
    mat-form-field {
      width: 100%;
    }
    .hidden-row {
      display: none;
    }
    .whiteIcon{
      color: #fff;
    }
  `],
  providers: [
    TableValidatorService,
    DialogsService
  ]
})
export class EditableTableComponent implements OnInit {
  @Input() tableConfig: any;
  displayedColumns;
  deltaOfTableEntries = [];
  @Output() tableEntriesChange = new EventEmitter<TableRow[]>();

  dataSource: TableDataSource<TableRow>;
  thresholdMax = false;
  showProgess = true;
  showTable = false;
  startTable = false;
  errOnLoadTable = false;
  name: string;
  constructor(private tableValidator: TableValidatorService, private _http: HttpClient, private dialogsService?: DialogsService, public snackBar?: MatSnackBar) {
  }

  ngOnInit() {
    /** Column definitions in order */
    this.displayedColumns = this.tableConfig.columns.map(x => {
      if (x.display) {
        return x.columnDef;
      }
    });

    this.displayedColumns = this.displayedColumns.filter(col => col !== undefined);


    // console.log("this.displayedColumns", this.displayedColumns);
    this.loadTable();
  }
  enableTable() {
    if (this.tableConfig.disabled){
      return;
    }
    this.startTable = true;
  }
  loadTable() {
    this.showTable = false;
    this.errOnLoadTable = false;
    this.showProgess = true;
    this._http.get(this.tableConfig.endPoint)
      // .map(response => response.text().length > 0 ? response.json() : null)
      .subscribe(res => {
        const headers = res.headers;
        const data = res.text().length > 0 ? res.json() : null;
        // overwrite with X-permission
        this.tableConfig.disabled = !(headers.get('x-permission') === '1');
        this.tableEntriesChange.emit(data);
        this.startTable = data.length > 0;
        this.thresholdMax = !(data.length < this.tableConfig.threshold);
        this.dataSource = new TableDataSource<any>(data, this.tableConfig, this._http, TableRow);


        this.dataSource.datasourceSubject.subscribe(tableEntries => {
          this.tableEntriesChange.emit(tableEntries);
          this.deltaOfTableEntries = tableEntries;
          this.thresholdMax = !(tableEntries.length < this.tableConfig.threshold);
        });

        this.showProgess = false;
        this.errOnLoadTable = false;
        this.showTable = true;

      }, err => {
        this.showProgess = false;
        this.showTable = false;
        this.errOnLoadTable = true;
      });
  }
  tryAgain() {
    this.errOnLoadTable = false;
    this.showTable = false;
    this.showProgess = true;
    this.loadTable();
  }
  showColumn(col: string): string {
    return (col !== 'id') ? null : 'hidden-row';
  }
  confirmEditCreate(row) {
    if (!row.validator.valid) {
      return false
    }
    this.dataSource.confirmCreate(row, this.tableConfig)
      .then(this.showSnackBar.bind(this))
      .then(this.loadTable.bind(this))
      .catch(r => console.log(r))

  }
  showSnackBar() {
    this.snackBar.openFromComponent(SnackBarSuccessComponent, {duration: 2000});
  }
  public openDialog(row) {
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
          this.dataSource.delete(row, this.tableConfig);
        }
      });
  }
}

class TableRow {
  id: string;
}


