import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { StoreVisitService } from '../store-visit.service';
import { AuthorizeService } from '../../../Shared/authorize.service';
import { Constants } from '../../../Shared/constants';
import { ParseJsonDatePipe } from '../../../Shared/Pipes/parse-json-date.pipe';
import { CommonFunc } from '../../../Shared/commonFunc';
import * as moment from 'moment';

@Component({
  selector: 'app-retailer-leads-for-visit',
  templateUrl: './retailer-leads-for-visit.component.html',
  styleUrls: ['./retailer-leads-for-visit.component.css'],
  providers: [ParseJsonDatePipe]
})
export class RetailerLeadsForVisitComponent implements OnInit {

  constructor(private storeVisitService: StoreVisitService,
    private datePipe: DatePipe,
    private parseJsonDatePipe: ParseJsonDatePipe,
    private authorizeService: AuthorizeService) { }

    IsVisited = 0;
    Keyword:string='';
    RetailerLeadsForVisitList:any = [];
    page='';
    IsMapped:any = 0;
    InterestedLead: boolean = false;

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
    this.PopulateGrid();
  }

  ChangeStatus(e){
    this.IsVisited = e.target.value;
    if(this.IsVisited == 1){
      this.InterestedLead = true;
      this.ChangeCheckStatus(this.InterestedLead)
    }else{
      this.InterestedLead = false;
    }
    this.PopulateGrid();
    }
  
    ChangeCheckStatus(InterestedLead){
      this.InterestedLead = InterestedLead;
      this.PopulateGrid();
    }

  PopulateGrid () {

    this.storeVisitService.ReachableLead(this.Keyword,this.IsVisited, this.InterestedLead).subscribe(
      (res) => {
       console.log(res);
       for(var l=0; l<res.length; l++){
         res[l].UploadDate = moment(res[l].UploadDate).format("DD MMM, YYYY");
         res[l].isSelected = false;
       }
       this.RetailerLeadsForVisitList = res;
      }, (err: any) => {
        CommonFunc.handleError(err);
      }
    );
  }

  onPageChange(pagenumber) {
    // console.log(val);
    this.page = pagenumber;
  }

}
