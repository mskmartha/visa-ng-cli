import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {AdminApiService} from './admin-api.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {GlobalSharedService} from '../shared/shared.service';
import {Subject} from 'rxjs/Rx';
import {UtilsService} from '../shared/utils.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit, AfterViewInit {
  tableDataReceived = false; // Used to add the spinner while the table data is being loaded
  assessments = [];
  assessmentSummary: any = [];
  summaryReceived = false;
  engagementSummary: any;
  firstLoad = true;
  filterData;
  data: Subject<any> = new Subject();
  stillloadingInner = false;
  norecordsInner = false;
  recordsErrInner = false;
  selectedRow;
  moreDetails;
  filterDataReceived = false;
  public chartLabels:string[] = [];
  public chartData:number[] = [];
  public statusChartLabels:string[] = [];
  public statusChartData:number[] = [];
  public ratingChartLabels:string[] = [];
  public ratingChartData:number[] = [];
  public typeChartLabels:string[] = ['Internal(SA)', 'External(CSA)'];
  public typeChartData:number[] = [321, 123];
  dataReceived = false;
  tableLabels = [];
  myDataSource = new MatTableDataSource();
  paginationDetail = new BehaviorSubject(
    {
      length: 10,
      pageIndex: 0,
      pageSize: 10
    });
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public alineChartData:Array<any> = [
    [265, 259, 280, 281, 256, 155, 340],
    [35, 159, 82, 181, 436, 255, 240],
    [65, 139, 318, 381, 256, 135, 340],
    [252, 339, 280, 281, 426, 455, 240],
    [352, 439, 280, 281, 326, 355, 240],
    [228, 348, 240,219, 286, 127, 190]
  ];
  public alineChartLabels:Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public alineChartType:string = 'line';
  public pieChartType:string = 'doughnut';

  // Pie
  public pieChartLabelss:string[] = ['Download Sales', 'In-Store Sales', 'Mail Sales'];
  public pieChartDatas:number[] = [300, 500, 100];

  public randomizeType():void {
    this.alineChartType = this.alineChartType === 'line' ? 'bar' : 'line';
    this.pieChartType = this.pieChartType === 'doughnut' ? 'pie' : 'doughnut';
  }
  // lineChart
  public lineChartData:Array<any> = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'High'},
    {data: [28, 48, 40, 19, 86, 27, 90], label: 'Medium'},
    {data: [18, 48, 77, 9, 100, 27, 40], label: 'Low'}
  ];
  public lineChartLabels:Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public chartOptions:any = {
    responsive: true
  };
  public pieChartOptions:any = {
    responsive: true,
    showAllTooltips:true,
    legend: {
      display: true,
      labels: {
        fontColor: 'rgb(255, 99, 132)'
      }
    }
  };
  public lineChartOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true,
    scaleShowValues: true,
    scaleValuePaddingX: 10,
    scaleValuePaddingY: 10,
    animation: {
      onComplete: function () {
        var chartInstance = this.chart,
          ctx = chartInstance.ctx;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        this.data.datasets.forEach(function (dataset, i) {
          var meta = chartInstance.controller.getDatasetMeta(i);
          meta.data.forEach(function (bar, index) {
            var data = dataset.data[index];
            ctx.fillText(data, bar._model.x-index, bar._model.y - 5);
          });
        });
      }
    }  };
  public lineChartColors:Array<any> = [
    { // grey
      backgroundColor: '#dc354533',
      borderColor: '#dc3545',
      pointBackgroundColor: '#dc3545',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#dc3545'
    },
    { // dark grey
      backgroundColor: '#fec10733',
      borderColor: '#ffc107',
      pointBackgroundColor: '#ffc107',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#ffc107'
    },
    // { // dark grey
    //   backgroundColor: 'rgba(77,83,96,0.2)',
    //   borderColor: 'rgba(77,83,96,1)',
    //   pointBackgroundColor: 'rgba(77,83,96,1)',
    //   pointBorderColor: '#fff',
    //   pointHoverBackgroundColor: '#fff',
    //   pointHoverBorderColor: 'rgba(77,83,96,1)'
    // },
    { // grey
      backgroundColor: '#28a74533',
      borderColor: '#28a745',
      pointBackgroundColor: '#28a745',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#28a745'
    }
  ];
  public lineChartLegend:boolean = true;
  public lineChartType:string = 'line';
  private currentNode;

  public barChartData: any[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
  ];

  public randomize():void {
    this.lineChartType = this.lineChartType === 'line' ? 'bar' : 'line';
    let _lineChartData:Array<any> = new Array(this.lineChartData.length);
    for (let i = 0; i < this.lineChartData.length; i++) {
      _lineChartData[i] = {data: new Array(this.lineChartData[i].data.length), label: this.lineChartData[i].label};
      for (let j = 0; j < this.lineChartData[i].data.length; j++) {
        _lineChartData[i].data[j] = Math.floor((Math.random() * 500) + 1);
      }
    }
    this.lineChartData = _lineChartData;
  }
  constructor(private adminApiService: AdminApiService,
              private utils: UtilsService,
              private sharedService: GlobalSharedService) { }
  ngOnInit() {
    this.data.subscribe(arr => {
      const deptMap = this.utils.jsonToStrMap(sessionStorage.getItem('departments'));
      if (arr.length > 0) {
        arr.map((item) => {
          if (deptMap.has(String(item.departmentId))) {
            item.departmentId = deptMap.get(String(item.departmentId));
          } else {
            item.departmentId = 'Other';
          }
          return item;
        });
      }
    });
    this.tableLabels = [
      {label: 'SA Id', columnName: 'saId'},
      {label: 'Camr Id', columnName: 'camrId'},
      {label: 'Department', columnName: 'departmentId'},
      {label: 'Type', columnName: 'saType'},
      {label: 'ACM Rating', columnName: 'acmRatingName'},
      {label: 'State', columnName: 'statusMessage'},
      {label: 'GoLive Date', columnName: 'releaseDate'}
      ];
    this.getAssessments();
    this.ratingChartLabels = ['Critical', 'High', 'Medium', 'Low'];
    this.ratingChartData = [123, 32, 43, 23];
  }
  ngAfterViewInit() {
    this.myDataSource.paginator = this.paginator;
  }
  getAssessments(filter = '') {
    this.tableDataReceived = false;
    this.filterDataReceived = false;
    this.adminApiService.getAssessments(filter).subscribe((obj: any) => {
      this.assessments = obj.securityAssessmentDOs;
      this.data.next(obj.securityAssessmentDOs);
      if(this.firstLoad) {
        let critical = 0;
        let high = 0;
        let medium = 0;
        let low = 0;
        let pendingScoping = 0;
        let pendingTriage = 0;
        let inProgress = 0;
        let onHold = 0;
        //  Department map
        const grouped = this.assessments.reduce((groups, cur) => {
          const key = cur.departmentId;
          // const key1 = cur.saRatingName;
          groups[key] = (groups[key] || 0) + 1;
          // groups[key1] = (groups[key1] || 0) + 1;

          return groups;
        }, {});

        const result = Object.keys(grouped).map(key => ({value: key, label: key, total: grouped[key]}));

        this.assessments.forEach((obj) => {
          switch (obj.acmRatingName) {
            case ("Critical"): critical ++;
              break;
            case ("High"): high ++;
              break;
            case ("Medium"): medium ++;
              break;
            case ("Low"): low ++;
              break;
          }
          switch (obj.statusId) {
            case (13): pendingScoping++;
              break;
            case (1): pendingTriage++;
              break;
            case (3): inProgress++;
              break;
            case (11): onHold++;
              break;
          }
        });
        this.adminApiService.getEngagementSummary().subscribe((res) => {
          this.engagementSummary = res;
          this.assessmentSummary.push(this.engagementSummary);
        });
        let arr = [
          {
            "name": "secAssessmentStateId",
            "label": "Status",
            "summary" : [
              {
                "value": 13,
                "label": "Pending Scoping",
                "total": pendingScoping
              },
              {
                "value": 1,
                "label": "Pending Triage",
                "total": pendingTriage
              },
              {
                "value": 3,
                "label": "In Progress",
                "total": inProgress
              },
              {
                "value": 11,
                "label": "On Hold",
                "total": onHold
              }
            ]
          },
          {
            "id": 2,
            "name": "acmRatingName",
            "label": "ACM Rating",
            "summary" : [
              {
                "value": "Critical",
                "label": "Critical",
                "total": critical
              },
              {
                "value": "High",
                "label": "High",
                "total": high
              },
              {
                "value": "Medium",
                "label": "Medium",
                "total": medium
              },
              {
                "value": "Low",
                "label": "Low",
                "total": low
              }
            ]
          },
          {
            "id": 3,
            "name": "departmentName",
            "label": "TLT",
            "summary" : result
          }
          ];
        // Appending the response to the assessmentSummary which will hold the engagement information
        this.assessmentSummary.push.apply(this.assessmentSummary, arr);
        this.firstLoad = false;
      }

      this.summaryReceived = true;
      this.myDataSource.data = this.assessments;
      this.tableDataReceived = true;
      this.dataReceived = true;
      this.filterDataReceived = true;
    });
  }
  showMoreDetails(key) {
    this.stillloadingInner = true;
    this.selectedRow = key.id;
    key.isEditing = true;
    this.adminApiService.getMoreDetails(key.id).subscribe((data) => {
      this.stillloadingInner = false;
      this.norecordsInner = false;
      this.recordsErrInner = false;
      this.moreDetails = data;
    }, err => {
      this.stillloadingInner = false;
      this.recordsErrInner = true;
      this.norecordsInner = false;
    });

  }
  cancelEdit(key) {
    key.isEditing = false;
    key.change = undefined;
  }
  // events
  public chartClicked(e:any, filter?):void {
    console.log(e);
    if (e.active.length > 0) {
      const chart = e.active[0]._chart;
      const activePoints = chart.getElementAtEvent(e.event);
      if ( activePoints.length > 0) {
        // get the internal index of slice in pie chart
        const clickedElementIndex = activePoints[0]._index;
        const label = chart.data.labels[clickedElementIndex];
        // get value by index
        const value = chart.data.datasets[0].data[clickedElementIndex];
        console.log(clickedElementIndex, label, value)
      }
    }
  }

  public chartHovered(e:any):void {
    console.log(e);
  }

  reloadMap() {
    console.log(1);
    this.dataReceived = !this.dataReceived;
    setTimeout(() => {
      this.dataReceived = !this.dataReceived;
    }, 0)
  }
  scrollToId(id = 'table') {
    document.getElementById(id).scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest'
    });

  }
  quickCardFilter(data) {
    this.scrollToId();
    this.filterData = data;
    this.getAssessments(this.filterData);
    console.log(this.filterData);
    console.log(data);
  }
  // Triggers on every tab change to get the mat-card data based on the selected tab
  // triggered by the event emitter on the pagination so that we know whenever the page changes
  getUpdate(event) {
    this.paginationDetail.next(event);
  }
}
