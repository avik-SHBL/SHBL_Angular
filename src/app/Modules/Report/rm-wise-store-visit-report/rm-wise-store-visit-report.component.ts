import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Constants } from '../../../Shared/constants';
import { AuthorizeService } from '../../../Shared/authorize.service';
import { CommonFunc } from '../../../Shared/commonFunc';

@Component({
  selector: 'app-rm-wise-store-visit-report',
  templateUrl: './rm-wise-store-visit-report.component.html',
  styleUrls: ['./rm-wise-store-visit-report.component.css']
})
export class RmWiseStoreVisitReportComponent implements OnInit {

	StartDate:any;
	Keyword:string = '';
	dt = new Date();
  Fday = new Date(this.dt.getFullYear(), this.dt.getMonth(), 1);
  EndDate:any;
	url : string = '';
  ShowLocation: boolean = false;

  constructor(private datePipe: DatePipe,
    private authorizeService: AuthorizeService) { }

  ngOnInit(): void {

    this.authorizeService.AuthorizeUserByRole('RetailerShaktiStoreVisitAdmin').subscribe(
      (res  ) => {
        // console.log(res);
        if(!res){
          this.authorizeService.AuthorizeUserByRole('RetailerShaktiStoreVisitRM').subscribe(
            (res1) => {
              // console.log(res1);
              if(!res1){
                this.authorizeService.AuthorizeUserByRole('RetailerShaktiAccounts').subscribe(
                  (res2) => {
                    // console.log(res2);
                    if(!res2){
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
                  });
              }
            }, (err1: any) => {
              CommonFunc.handleError(err1);
            }
            );
        }
      }, (err: any) => {
        CommonFunc.handleError(err);
      }
      );

  	//this.StartDate = this.datePipe.transform(this.Fday,'yyyy-MM-dd');
    this.StartDate =this.datePipe.transform(new Date(),'yyyy-MM-dd');
    this.EndDate = this.datePipe.transform(new Date(),'yyyy-MM-dd');
  	this.GenerateReport();

  }

  GenerateReport() {

    if(this.StartDate != null && this.EndDate != null) {
      this.url = Constants.apiURL + '/Report/RMWiseStoreVisitReport?StartDate=' + this.StartDate + '&EndDate=' + this.EndDate + '&ShowLocation=' + (this.ShowLocation == true ? 1 : 0) +'&SessionToken='+localStorage.getItem('token');
      // console.log(this.url);
    }
  }

}
