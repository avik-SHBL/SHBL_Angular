import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthorizeService } from 'src/app/Shared/authorize.service';
import { CommonFunc } from 'src/app/Shared/commonFunc';
import { Constants } from 'src/app/Shared/constants';

@Component({
  selector: 'app-view-hygiene-report',
  templateUrl: './view-hygiene-report.component.html',
  styleUrls: ['./view-hygiene-report.component.css']
})
export class ViewHygieneReportComponent implements OnInit {

  displaycontent: boolean = true;

  StartDate:any;
	Keyword:string = '';
	dt = new Date();
  Fday = new Date(this.dt.getFullYear(), this.dt.getMonth(), 1);
  EndDate:any;
	url : string = '';

  constructor(private datePipe: DatePipe, private authorizeService: AuthorizeService) { 
    var gettoken = localStorage.getItem("token");
    if (!gettoken) {
      this.displaycontent = false;
      return
    }
  }

  ngOnInit(): void {
    this.authorizeService.AuthorizeUserByRole('RetailerShaktiStoreVisitAdmin').subscribe(
      (res) => {
        // console.log("res", res);
        if (!res) {
          this.authorizeService.AuthorizeUserByRole('RetailerShaktiStoreVisitRM').subscribe(
            (res1) => {
              // console.log("res1", res1);
              if (!res1) {
                // alert('Warning! You do not have authorisation priviledges to access this page.');
                this.authorizeService.LogoutUser().subscribe(
                  (res) => {
                    console.log(res);
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

    this.StartDate = this.datePipe.transform(this.Fday,'yyyy-MM-dd');
    this.EndDate = this.datePipe.transform(new Date(),'yyyy-MM-dd');
  	this.GenerateReport();
  }

  GenerateReport() {
    if(this.StartDate != null && this.EndDate != null) {
      this.url = Constants.apiURL + '/Report/PresentabilityTrackerReport?StartDate=' + this.StartDate + '&EndDate=' + this.EndDate + '&SessionToken='+localStorage.getItem('token');
    }
  }

}