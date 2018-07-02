import { Component, Inject, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import { PSSLCodeScanService } from '../pssl-codescan.service';

declare var require: any;
@Component({
    selector : 'app-charts-section',
    templateUrl : './csGraphWizard.component.html',
    styleUrls: ['./chart-section.component.css'],
    providers: [PSSLCodeScanService]
  })

  export class PSSLCsGraphWizardComponent implements OnInit {
  public pieChartTitle = 'Most Vulnerable Files';
  public barChartTitle = 'Result Summary';
  public doughChartTitle = 'Top 5 Vulnerabilities';
  public pieChartType = 'pie';
  public barChartType = 'bar';
  public barDatasets: any[] = [];
  public doughnutChartType = 'doughnut';

  public pieChartLabels: any[] = [];
  public pieChartData: number[] = [];

  public barChartLabels: string[] = [];
  public barChartData: any[] = [];

  public codeScanDtls;
  public doughnutChartLabels: string[] = [];
  public doughnutChartData: number[] = [];
  public isDataAvailable = false;
  constructor(@Inject(MAT_DIALOG_DATA) codeScanDtls, private _psslCodeScanService: PSSLCodeScanService) {
    this.codeScanDtls = codeScanDtls;
  }
  ngOnInit() {
    this.getGraphDetail();
  }

  getGraphDetail() {
    this._psslCodeScanService.getGraphDetail(
      this.codeScanDtls.scanId).subscribe(result => this.populateInfo(result));
  }

  populateInfo(res): void {
    const pieLabels: string[] = [];
    const pieValue: number[] = [];
    const barLabels: string[] = [];
    const barValue: number[] = [];
    const doughLabels: string[] = [];
    const doughValue: number[] = [];
    for (const pieItem of res.topFiles) {
      pieLabels.push(String(pieItem.label));
      pieValue.push(pieItem.value);
    }
    this.pieChartData = pieValue;
    this.pieChartLabels = pieLabels;
    for (const barItem of res.status) {
      barLabels.push(String(barItem.label));
      barValue.push(barItem.value);
    }
    this.barChartData = barValue;
    this.barChartLabels = barLabels;
    this.barDatasets = [{
      label: 'Finding Count',
      data: this.barChartData
    }];
    for (const doughItem of res.topFindings) {
      doughLabels.push(String(doughItem.label));
      doughValue.push(doughItem.value);
    }
    this.doughnutChartData = doughValue;
    this.doughnutChartLabels = doughLabels;
    this.isDataAvailable = true;
  }
  // events
  public chartClicked(e: any): void {
    // console.log(e);
  }

  public chartHovered(e: any): void {
    // console.log(e);
  }
}
