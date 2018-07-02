 import { Component, NgModule, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {AppScopingService} from '../pssl-appscoping.service';
import { NgForm } from '@angular/forms';
@Component({
    selector : 'feature-search-jira',
    templateUrl : './feature-search-jira.component.html',
    styles:[`
        mat-form-field{
            width:95%;
        }
    `],
    providers: [AppScopingService]
})
export class FeatreSrchJiraCompnt implements OnInit {
  public params;
  public ldrFindingDtl: Array<any> = [];
  totalJiraFeatures;
  public modalStepper = true;
  public showProgess = false;
  public submitSASucess = false;
  public errOnSubmit = false;
  constructor(@Inject(MAT_DIALOG_DATA) params: any, private _lldrService: AppScopingService) {
      this.params = params;
  }

  ngOnInit() {
      if (this.params.forceSync === 'sync') {
          this.forceFeaturesJira(this.params);
      }
  }

  forceFeaturesJira(form?: NgForm): void {
      // console.log(form.value.jiraId);
      this.modalStepper = false;
      this.showProgess = true;

      this._lldrService.forceFeaturesJira(this.params).subscribe(res => {
          this.showProgess = false;
          this.modalStepper = false;
          this.submitSASucess = true;
          this.totalJiraFeatures = res;
      }, err => {
          this.showProgess = false;
          this.modalStepper = false;
          this.submitSASucess = false;
          this.errOnSubmit = true;
      });
  }
  getJIRAFeatures(form?:NgForm) : void {
      // console.log(form.value.jiraId);
      this.modalStepper = false;
      this.params.jiraId = form.value.jiraId;
      this.showProgess = true;

      this._lldrService.getFeaturesJira(this.params).subscribe(res => {
          this.showProgess = false;
          this.modalStepper = false;
          this.submitSASucess = true;
          this.totalJiraFeatures = res;
      }, err => {
          this.showProgess = false;
          this.modalStepper = false;
          this.submitSASucess = false;
          this.errOnSubmit = true;
      });
  }
}
