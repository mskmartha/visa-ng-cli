/**
 * Created by smartha on 6/4/17.
 */
import {Component, AfterViewInit, ViewChild, ViewChildren, Input, Inject, OnInit} from '@angular/core';
import {MatCard, MatDialog, MatTabGroup, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {NgForm, FormsModule, ReactiveFormsModule, FormGroup, FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { SaarWizardComponent } from './saar-wizard/saarWizard.component';
import { SaarFindingComponent } from './saar-finding/saar-finding.component';
import { SaarScopingComponent } from './saar-scoping/saar-scoping.component';
import { SAARService } from './pssl-saar.service';


@Component({
  selector: 'pssl-saar',
  templateUrl: './pssl-saar.component.html',
  styleUrls: ['./pssl-saar.component.css'],
  providers: [SAARService]
})
export class PSSLSaarComponent implements OnInit{
  @ViewChild(SaarFindingComponent) saarFindingsChild;
  @ViewChild(SaarScopingComponent) saarScopingChild;

  public params: any;
  findingName: string;
  findingDesc: string;
  remediation: string;
  severity: string;
  componentName: string;
  findingStatus: string;
  findingComments: string;
  public _selectedIndex: number = 0;
  shouldShow:boolean = false;
  constructor(private _saarService: SAARService, public dialog: MatDialog) {
  }
  ngOnInit() {
    this.shouldShow = true;
  }
  loadTabContent(tabgroup: MatTabGroup) {
        //1=Security Scoping
        //2=Design Review
        //3=Architecture Review
        //4=Static Code Analysis

        let pid = tabgroup._tabs.find((e, i, a) => i == tabgroup.selectedIndex)
            .content.viewContainerRef.element.nativeElement.dataset.pid;

        if(pid==2){
            this.saarFindingsChild.loadSaar();
        }
    }
  get selectedIndex(): number {
      return this._selectedIndex;
  }
  set selectedIndex(selectedIndex: number) {
      this._selectedIndex = selectedIndex;
  }
 openClassicDialog() {
    let dialogRef = this.dialog.open(SaarWizardComponent
    );
    dialogRef.disableClose = true;
  }
}
