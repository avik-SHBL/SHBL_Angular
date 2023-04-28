import { Component, OnInit } from '@angular/core';
import { StoreVisitService } from '../store-visit.service';
import { DatePipe } from '@angular/common';
import { AuthorizeService } from '../../../Shared/authorize.service';
import { Constants } from '../../../Shared/constants';
import { CommonFunc } from '../../../Shared/commonFunc';

@Component({
  selector: 'app-rm-visit-schedular',
  templateUrl: './rm-visit-schedular.component.html',
  styleUrls: ['./rm-visit-schedular.component.css']
})
export class RmVisitSchedularComponent implements OnInit {

	RevenueOfficerList : any = [];

	Keyword : string = '';

	Month : any = '';

	UserID : any = '';

	SMLList : any = []

	innerCalendar : string = '';

	mon : number = 0;

	dt = new Date();
  curMonth = this.dt.getMonth() + 1;
  curYr = this.dt.getFullYear();

  CurDate = this.datePipe.transform(new Date(),'dd-MM-yyyy');

  UserName : string = '';

  constructor(private storeVisitService: StoreVisitService,
  	private datePipe: DatePipe,
    private authorizeService: AuthorizeService) { }

  ngOnInit(): void {

    this.authorizeService.AuthorizeUserByRole('RetailerShaktiStoreVisitAdmin').subscribe(
      (res) => {
        // console.log(res);
        if(!res){
          this.authorizeService.AuthorizeUserByRole('RetailerShaktiStoreVisitRM').subscribe(
            (res1) => {
              // console.log(res1);
              if(!res1){
                alert('Warning! You do not have authorisation priviledges to access this page.');
                this.authorizeService.LogoutUser().subscribe(
                  (res) => {
                    // console.log(res);
                  }, (err: any) => {
                    CommonFunc.handleError(err);
                  });
                localStorage.removeItem('token');
                location.href = Constants.siteURL;
              }
            }, (err: any) => {
              CommonFunc.handleError(err);
            }
            );
        }
      }, (err: any) => {
        CommonFunc.handleError(err);
      }
      );

    this.Month = this.curMonth;

    this.GetRMList();

  }

  GetRMList() {
    this.storeVisitService.GetRMList(this.Keyword).subscribe(
      (res) => {
        // console.log(res);
        this.RevenueOfficerList = res;
        if(res.length == 1) {
          this.UserID = res[0].MemberID;
        }
      }, (err: any) => {
        CommonFunc.handleError(err);
      }
      );
  }

  GetName() {
  	// console.log(this.UserID);
  	if (this.UserID != 0) {
  		var filterRO = this.RevenueOfficerList.filter(f => f.MemberID == this.UserID);
  		// console.log(filterRO);
  		if (filterRO != null) { this.UserName = filterRO[0].FirstName.trim(); }
  	}
  }

  PopulateGrid() {
    // console.log(this.Month, this.UserID);    

    var div = document.getElementById("dvCalendar")  as HTMLDivElement;
    if(this.Month != '' && this.UserID != '') {
      this.storeVisitService.GetRMVisitScheduleCalendar(this.UserID, this.Month).subscribe(
        (res) => {
          // console.log(res);

          this.SMLList = [];

          this.GetName();

          this.innerCalendar = "<table class='table table-bordered'><tr>";

          if (this.Month < 10)
            { this.mon = 0 + this.Month; }
          else
            { this.mon = this.Month }        	

          var date = new Date(this.mon + '/01/' + this.curYr);
          var day = date.getDay();

          var weekdays = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");

          var monthAbbrvName = date.toDateString().substring(4, 7);
          this.innerCalendar += "<th colspan=7  class='p-3 text-center' style='border: 1px solid #7F0323;background-color:#F8BD9E;font-family:Lucida Handwriting;font-size:20px'>" + monthAbbrvName + ", " + this.curYr + "</th></tr><tr>";
          var j = day;

          for (var i = 0; i < 7; i++) {
            this.innerCalendar += "<th class='p-3 text-center' style='border: 1px solid #7F0323;background-color:#F9CB2C;font-family:Lucida Handwriting;font-size:20px'>" + weekdays[j] + "</th>";
            j++;
            if (j > 6)
              j = 0;
          }
          this.innerCalendar += "</tr><tr>"

          for (var i = 0; i < res.length; i++) {
            var row = res[i];
            this.SMLList.push({
              VisitDate: this.datePipe.transform(new Date(parseInt(row.VisitDate.replace('/Date(', '').replace(')/', ''))), 'dd-MM-yyyy'),
              VisitScheduleCount: row.VisitScheduleCount,
              VisitDateForSchedule: this.datePipe.transform(new Date(parseInt(row.VisitDate.replace('/Date(', '').replace(')/', ''))), 'MM-dd-yyyy'),
            });

            // console.log(this.SMLList);

            if (this.SMLList[i]["VisitScheduleCount"] == 0) {
              // console.log(this.SMLList[i]["VisitDateForSchedule"]);

              if (this.CurDate == this.SMLList[i]["VisitDate"]) {

                this.innerCalendar += "<td class='p-3 text-left' style='border: 1px solid #ff9f80;background-color:pink;font-family:Lucida Handwriting;font-size:18px'>" + this.SMLList[i]["VisitDate"].substring(0, 2) + "<p align='right' style='font-size:12px'><br>"
                + "<button onclick='ScheduleDateForRetailerShakti(\"" + this.SMLList[i]["VisitDateForSchedule"] + "\",\"" + this.UserID + "\",\"" + this.UserName + "\",\"" + 0 + "\")'>Make Schedule</button>"

                + "</p></td>";
              }
              else {

                this.innerCalendar += "<td class='p-3 text-left' style='border: 1px solid #ff9f80;background-color:#ffffb3;font-family:Lucida Handwriting;font-size:18px'>" + this.SMLList[i]["VisitDate"].substring(0, 2) + "<p align='right' style='font-size:12px'><br>"
                + "<button onclick='ScheduleDateForRetailerShakti(\"" + this.SMLList[i]["VisitDateForSchedule"] + "\",\"" + this.UserID + "\",\"" + this.UserName + "\",\"" + 0 + "\")'>Make Schedule</button>"

                + "</p></td>";
              }

            }
            else {
              if (this.CurDate == this.SMLList[i]["VisitDate"]) {
                this.innerCalendar += "<td class='p-3 text-left' style='border: 1px solid #ff9f80;background-color:pink;font-family:Lucida Handwriting;font-size:18px'>" + this.SMLList[i]["VisitDate"].substring(0, 2) + "<p align='right' style='font-size:12px'><br>"
                + "<button style='background-color:lightgreen;font-weight:bold;' onclick='ScheduleDateForRetailerShakti(\"" + this.SMLList[i]["VisitDateForSchedule"] + "\",\"" + this.UserID + "\",\"" + this.UserName + "\",\"" + 1 + "\")'>Scheduled Visit " + this.SMLList[i]["VisitScheduleCount"] + " </button>"

                + "</p></td>";
              }
              else {

                this.innerCalendar += "<td class='p-3 text-left' style='border: 1px solid #ff9f80;background-color:#ffffb3;font-family:Lucida Handwriting;font-size:18px'>" + this.SMLList[i]["VisitDate"].substring(0, 2) + "<p align='right' style='font-size:12px'><br>"
                + "<button style='background-color:lightgreen;font-weight:bold;' onclick='ScheduleDateForRetailerShakti(\"" + this.SMLList[i]["VisitDateForSchedule"] + "\",\"" + this.UserID + "\",\"" + this.UserName + "\",\"" + 1 + "\")'>Scheduled Visit " + this.SMLList[i]["VisitScheduleCount"] + " </button>"

                + "</p></td>";
              }
            }


            if ((i + 1) % 7 == 0)
              { this.innerCalendar += "</tr><tr>"; }

          }
          this.innerCalendar += "</tr></table>";

          //}
          //else {

            //    $scope.innerCalendar = "<h1>Please select revenue officer and then make visit schedule.</h1>";

            //}
            
            div.innerHTML = this.innerCalendar;
          }, (err: any) => {
        CommonFunc.handleError(err);
      });
    }
    else { div.innerHTML = ''; }

  }

}
