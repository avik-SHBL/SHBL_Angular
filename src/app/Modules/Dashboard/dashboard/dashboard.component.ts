import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DashboardService } from '../dashboard.service';
import { Chart, ChartType, ChartOptions, ChartDataSets } from 'chart.js';
import { SingleDataSet, Label, Color } from 'ng2-charts';
import { Constants } from '../../../Shared/constants';
import { ReportService } from '../../Report/report.service';
import { AuthorizeService } from '../../../Shared/authorize.service';
import * as pluginLabels from 'chartjs-plugin-labels';
import { CommonFunc } from '../../../Shared/commonFunc';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

	xValues:any=[];
  yValues:any = [];
  xValues1:any = [];
  yValues1:any = [];
  yOnBoard:any = [];
  yOnBoard1:any = [];

	StartDate:any;
	Keyword:string = '';
	dt = new Date();
  Fday = new Date(this.dt.getFullYear(), this.dt.getMonth(), 1);
  EndDate:any;
  url : string = '';
  
  ChartHandler: any= null;

  ShortRemarkArr:any = [];
  ShortRemarkValueArr:any = [];
  ShortRemarkColorArr:any = [];

  NoOfMonth:number = 6;

  StoreVisitOnBoardMonthArr:any = [];
  StoreVisitOnBoardValueArr:any = [];

  pieChartOptions: ChartOptions = {};
  pieChartLabels: Label[] = [];
  pieChartData: SingleDataSet[] = [];
  pieChartType: ChartType = 'pie';
  pieChartLegend: boolean = false;
  pieChartPlugins: any = [];
  pieChartColors: Color[] = [];
  
  constructor(private dashboardService: DashboardService,
    private datePipe: DatePipe,
    private reportService: ReportService,
    private authorizeService: AuthorizeService
  ) { }

  ngOnInit(): void {   

    // console.log(localStorage.getItem('token'), Constants.apiURL, Constants.siteURL);

    // this.authorizeService.AuthorizeUserByRole('RetailerShaktiStoreVisitAdmin').subscribe(
    //   (res  ) => {
    //     // console.log(res);
    //     if(!res){
    //       this.authorizeService.AuthorizeUserByRole('RetailerShaktiStoreVisitRM').subscribe(
    //         (res1) => {
    //           // console.log(res1);
    //           if(!res1){
    //             this.authorizeService.AuthorizeUserByRole('RetailerShaktiAccounts').subscribe(
    //               (res2) => {
    //                 // console.log(res2);
    //                 if(!res2){
    //                   alert('Warning! You do not have authorisation priviledges to access this page.');
    //                   this.authorizeService.LogoutUser().subscribe(
    //                     (res) => {
    //                       // console.log(res);
    //                     }, (err: any) => {
    //                       CommonFunc.handleError(err);
    //                     });
    //                   localStorage.removeItem('token');
    //                   location.href = Constants.siteURL;
    //                 }
    //               });
    //           }
    //         }, (err1: any) => {
    //           CommonFunc.handleError(err1);
    //         }
    //         );
    //     }
    //   }, (err: any) => {
    //     CommonFunc.handleError(err);
    //   }
    //   );

      if (localStorage.getItem('StartDate')!=undefined && localStorage.getItem('StartDate')!=null)
      {
        this.StartDate = localStorage.getItem('StartDate');
        this.EndDate = localStorage.getItem('EndDate');
        localStorage.removeItem('StartDate'); 
        localStorage.removeItem('EndDate'); 
         
      }
      else
      {
          this.StartDate = this.datePipe.transform(this.Fday,'yyyy-MM-dd');
          this.EndDate = this.datePipe.transform(new Date(),'yyyy-MM-dd');
           
      }
      this.LoadReport()
  	

  }  

  parseData = function (model,ParseType) {
    
    for (var property in model) {
      if (ParseType == "District" && model.hasOwnProperty(property) && property.indexOf('District') != -1) {
        var jsonDistrictString = model[property] || '';
        if (jsonDistrictString.length > 0) {
          this.xValues.push(jsonDistrictString);                   
        }
      }

      if (ParseType == "RO" && model.hasOwnProperty(property) && property.indexOf('RMName') != -1) {
        var jsonROString = model[property] || '';
        if (jsonROString.length > 0) {
          this.xValues1.push(jsonROString);
        }
      }

      if (ParseType == "District" && model.hasOwnProperty(property) && property.indexOf('StoreVisited') != -1) {
        var jsonStoreVisitedString = model[property] || '';                   
        this.yValues.push(jsonStoreVisitedString);
      }

      if (ParseType == "RO" && model.hasOwnProperty(property) && property.indexOf('StoreVisited') != -1) {
        var jsonStoreVisitedString = model[property] || '';
        this.yValues1.push(jsonStoreVisitedString);
      }

      if (ParseType == "District" && model.hasOwnProperty(property) && property.indexOf('ONBOARD') != -1) {
        var jsonOnBoardString = model[property] || '';                
        this.yOnBoard.push(jsonOnBoardString);                 
      }

      if (ParseType == "RO" && model.hasOwnProperty(property) && property.indexOf('ONBOARD') != -1) {
        var jsonOnBoardString = model[property] || '';                 
        this.yOnBoard1.push(jsonOnBoardString);                 
      }
    }
  } 

  PopulateChartDistrictWise() {
  	// console.log(this.StartDate, this.EndDate);
  	this.xValues = [];
    this.yValues = [];
    this.yOnBoard = [];

    this.dashboardService.GetStoreVisitDistrictWise(this.StartDate, this.EndDate).subscribe(
      (res) => {
        // console.log(res);
        for (var i = 0; i < res.length; i++) {
          this.parseData(res[i], 'District');
        }

        this.MakeChart('District wise store visits','DistrictChart');
      }, (err: any) => {
        CommonFunc.handleError(err);
      }
      );
  }

  PopulateChartROWise() {
    // console.log(this.StartDate, this.EndDate);
    this.xValues1 = [];
    this.yValues1 = [];
    this.yOnBoard1 = [];

    this.dashboardService.GetStoreVisitROWise(this.StartDate, this.EndDate).subscribe(
      (res) => {
        // console.log(res);
        for (var i = 0; i < res.length; i++) {
          this.parseData(res[i], 'RO');
        }

        this.MakeChart('RM wise store visits','ROChart');
      }, (err: any) => {
        CommonFunc.handleError(err);
      }
      );
  }

  PopulateChartRemarkStatus() {
    //console.log(this.StartDate, this.EndDate, this.Keyword);

    this.dashboardService.GetStoreVisitRemarkStatus(this.StartDate, this.EndDate).subscribe(
      (res) => {
        // console.log(res);    

        for (var i = 0; i < res.length; i++) {

          this.ShortRemarkArr.push(res[i].ShortRemark);
          this.ShortRemarkValueArr.push(res[i].StoreVisited);
          this.ShortRemarkColorArr.push(res[i].ShortRemarkColor);

        }

        this.MakePie();
      }, (err: any) => {
        CommonFunc.handleError(err);
      }
      );
  }

  PopulateChart_OnBoardMonthlyStatus() {

    this.dashboardService.GetOnBoardMonthly(this.NoOfMonth).subscribe(
      (res) => {
        // console.log(res);    

        for (var i = 0; i < res.length; i++) {

          this.StoreVisitOnBoardMonthArr.push(res[i].VisitMonth);
          this.StoreVisitOnBoardValueArr.push(res[i].ON_BOARD);

        }

        this.MakeLine();
      }, (err: any) => {
        CommonFunc.handleError(err);
      }
      );
  }

  private createOptions(): ChartOptions {
    return {
      responsive: true,
          maintainAspectRatio: true,
          plugins: {
              labels: {
                render: 'percentage',
                fontColor: 'black', //['green', 'white', 'red'],
                precision: 2
              },
          },
          events: ['mousemove'],
          title: {
                display: true,
                text: 'Store Visit Status'
              },
    };
  }

  MakePie = function() {

    // new Chart('RemarkStatusChart', {
    //   type: 'pie',
    //   data: {
    //     labels: this.ShortRemarkArr,
    //     datasets: [{
    //       label: 'Store Visit Remark Status',
    //       data: this.ShortRemarkValueArr,
    //       backgroundColor: this.ShortRemarkColorArr
	   // }]
    //   },
    //   options: {
    //     //legend: { display: true },
    //     title: {
    //       display: true,
    //       text: 'Store Visit Status'
    //     },
    //     events: [],
    //   }
    // })

    this.pieChartOptions = this.createOptions();
    this.pieChartLabels = this.ShortRemarkArr;  //['January', 'February', 'March'];
    this.pieChartData = this.ShortRemarkValueArr; //[50445, 33655, 15900]
    this.pieChartType = 'pie';
    this.pieChartLegend = true;
    this.pieChartPlugins = [pluginLabels];
    this.pieChartColors = [{ backgroundColor: this.ShortRemarkColorArr }];

  }

  MakeLine = function() {

    new Chart('OnBoardStatusChart', {
      type: 'line',
      data: {
        labels: this.StoreVisitOnBoardMonthArr, 
        datasets: [{
          label: 'ON BOARD',
          data: this.StoreVisitOnBoardValueArr, 
          fill: false,
          borderColor: 'rgb(75, 192, 192)' 
           
        }]
      },
      options: {
        //legend: { display: true },
        title: {
          display: true,
          text: 'Monthly On Board Status'
        },
        elements: {
        line: {
            tension: 0
        }
        },
        events: []
      }
    })

  }

  MakeChart = function (title,ChartName) {
    /////----Chart------
 
      new Chart(ChartName, {
      type: "bar",
      data: {
        labels: ChartName == "DistrictChart" ? this.xValues : this.xValues1, ///xValues,
        datasets: [
        {
          label: "On Board",
          backgroundColor: "green",
          data: ChartName == "DistrictChart" ? this.yOnBoard : this.yOnBoard1
        }
        ,
        {
          label: "Store Visit",
          backgroundColor: "blue",
          data: ChartName=="DistrictChart"? this.yValues:this.yValues1
        }]
      },
      options: {
        
        responsive: true,
        maintainAspectRatio: true,
        tooltips: {
          mode: 'index',
          intersect: false
       },

        scales: {
          yAxes: [{
            ticks: {
                precision: 0,
                beginAtZero: true,
            },
            scaleLabel: {
              display: true,
              labelString: 'Visit Count'
            }
          }],
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: ChartName == "DistrictChart" ? 'District' : 'RM'
            }
          }]
        },
        legend: { display: true },
        plugins: {
          labels: false          
        },
        title: {
          display: true,
          text: title
        },
        
        events: ['mousemove']
      }
    });
 
    
  }

  // PopulateRMWiseReport(){
  //   this.url = Constants.apiURL + '/Report/RMWiseStoreVisitReport?StartDate=' + this.StartDate + '&EndDate=' + this.EndDate + '&ShowLocation=' + 1+'&SessionToken='+localStorage.getItem('token');
  //   // console.log(this.url);
  //   this.PopulateReport(this.url);
  // }

  // PopulateReport(url){
  //   this.url = url;
  // }

  GenerateReport():void {
   
    localStorage.setItem('StartDate', this.StartDate);
    localStorage.setItem('EndDate', this.EndDate);
    window.location.reload();
  
  
  }

  LoadReport():void {
   

   this.ShortRemarkArr = [];
   this.ShortRemarkValueArr = [];
   this.ShortRemarkColorArr = [];

   this.StoreVisitOnBoardMonthArr = [];
   this.StoreVisitOnBoardValueArr = [];

     this.PopulateChartDistrictWise();
     this.PopulateChartROWise();
     this.PopulateChartRemarkStatus();
     this.PopulateChart_OnBoardMonthlyStatus();
 

  }

}
