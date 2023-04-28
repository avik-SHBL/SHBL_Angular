import { Component, OnInit } from '@angular/core';
import { Constants } from '../../../Shared/constants';
import { CommonFunc } from '../../../Shared/commonFunc';
import { DatePipe } from '@angular/common';
import { AuthorizeService } from '../../../Shared/authorize.service';

@Component({
  selector: 'app-km-calculation',
  templateUrl: './km-calculation.component.html',
  styleUrls: ['./km-calculation.component.css']
})
export class KmCalculationComponent implements OnInit {

	StartDate:any;
	url: string = '';
	dt = new Date();
	Fday = new Date(this.dt.getFullYear(), this.dt.getMonth(), 1);
	EndDate:any;
	IsSummary: boolean;

  constructor( private datePipe: DatePipe,
    private authorizeService: AuthorizeService,) { }

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

    this.StartDate = this.datePipe.transform(this.Fday,'yyyy-MM-dd');
    
    var CurDate = new Date();
    CurDate.setDate(CurDate.getDate()-1);
    //this.EndDate = this.datePipe.transform(new Date(),'yyyy-MM-dd');
    this.EndDate = this.datePipe.transform(CurDate,'yyyy-MM-dd');
    this.IsSummary = true;
    this.GenerateReport();

  }

  GenerateReport() {
    // console.log(this.StartDate, this.EndDate);
    if(this.StartDate != null && this.EndDate != null) {
     this.url = Constants.apiURL + '/Report/KMCalculationReport?StartDate=' + this.StartDate + '&EndDate=' + this.EndDate + '&IsSummary='+(this.IsSummary == false ? 0 : 1)+'&SessionToken='+localStorage.getItem('token');
       //console.log(this.url);
    }

  }

}
