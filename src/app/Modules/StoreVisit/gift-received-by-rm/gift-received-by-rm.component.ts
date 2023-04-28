import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AuthorizeService } from '../../../Shared/authorize.service';
import { Constants } from '../../../Shared/constants';
import { StoreVisitService } from '../store-visit.service';
import { GiftReceivedByRMModel } from '../gift-received-by-rm/gift-received-by-rm';
import { ParseJsonDatePipe } from '../../../Shared/Pipes/parse-json-date.pipe';
import { CommonFunc } from '../../../Shared/commonFunc';

@Component({
  selector: 'app-gift-received-by-rm',
  templateUrl: './gift-received-by-rm.component.html',
  styleUrls: ['./gift-received-by-rm.component.css'],
  providers: [ParseJsonDatePipe]
})
export class GiftReceivedByRmComponent implements OnInit {

  StartDate:any;

  dt = new Date();
  Fday = new Date(this.dt.getFullYear(), this.dt.getMonth(), 1);

  CurDate: any;

  EndDate:any;

  Keyword: string = '';

  GiftReceivedByRMList: any = [];

  GiftReceivedByRM: any = {};

  ModalGiftReceivedByRMEntry: string = 'none';

  HideRO: boolean = false;

  RevenueOfficerList: any = [];

  page: number = 1;

  constructor(private datePipe: DatePipe,
  	private authorizeService: AuthorizeService,
    private parseJsonDatePipe: ParseJsonDatePipe,
    private storeVisitService: StoreVisitService) { }

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

    this.CurDate = this.datePipe.transform(new Date(),'dd/MM/yyyy');

  	this.StartDate = this.datePipe.transform(this.Fday,'yyyy-MM-dd');

    this.EndDate = this.datePipe.transform(new Date(),'yyyy-MM-dd');

    this.GiftReceivedByRM.ReceiveDate = this.datePipe.transform(new Date(),'yyyy-MM-dd');

    this.GiftReceivedByRM.RMID = '';

    this.PopulateGrid();

    this.GetRevenueOfficerList();

  }

  PopulateGrid() {

    //console.log(this.StartDate, this.EndDate, this.Keyword);
    this.GiftReceivedByRMList = [];
    if(this.StartDate != '' && this.EndDate != '') {
      this.storeVisitService.GetGiftReceivedByRMList(this.StartDate, this.EndDate).subscribe(
        (res) => {
          // console.log(res);        
          this.GiftReceivedByRMList = res;
        }, (err: any) => {
        CommonFunc.handleError(err);
      }
        );   
    } 

  }

  getToday(): string {
    return new Date().toISOString().split('T')[0]
  }

  GetRevenueOfficerList = function () {
        
        this.storeVisitService.GetRevenueOfficerList(this.Keyword).subscribe(
        	(res) => {
            //console.log(res);
            this.RevenueOfficerList = res || [];
            if (res.length == 1) {
                this.GiftReceivedByRM.RMID = res[0].MemberID;
                this.HideRO = true;
                this.PopulateGrid();
            }
            else {
                this.HideRO = false;
            }

        }, (err: any) => {
        CommonFunc.handleError(err);
      });

    }

  Delete(RMReceiptID) {

    if(confirm('Are you sure that you want to delete this particular record?')) {
      this.storeVisitService.GiftReceivedByRM_Delete(RMReceiptID).subscribe(
        (res) => {
          // console.log(res);
          this.PopulateGrid();
        }, (err: any) => {
        CommonFunc.handleError(err);
      }
        );
    }
    
  }

  Save() {    

    this.GiftReceivedByRM.SessionToken = localStorage.getItem('token');

    // console.log(this.GiftReceivedByRM);
    if(this.GiftReceivedByRM.ReceiveDate != '' && this.GiftReceivedByRM.Quantity != undefined && this.GiftReceivedByRM.RMID != '') {
      this.storeVisitService.GiftReceivedByRM_Insert(this.GiftReceivedByRM).subscribe(
        (res) => {
          // console.log(res);
          this.closeGiftReceivedByRMEntryPopup();
          this.PopulateGrid();
        }, (err: any) => {
        CommonFunc.handleError(err);
      });
    }
  }

  openGiftReceivedByRMEntryPopup() {

    this.ModalGiftReceivedByRMEntry = 'block';

  }

  closeGiftReceivedByRMEntryPopup() {

    this.ModalGiftReceivedByRMEntry = 'none';

  }

  ViewCurStock() {

    javascript: void (window.open(Constants.apiURL + '/Report/CurrentGiftStock?SessionToken='+localStorage.getItem('token'), '', 'toolbar=0,location=0,menubar=0,Width=700,Height=600, left=180,top=10'));

  }

  // Only Integer Numbers
  keyPressNumbers(event) {
    // console.log(event);
    if (event.keyCode == 189 || event.keyCode == 96 || event.keyCode == 110) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }

  onPageChange(pagenumber) {
    // console.log(val);
    this.page = pagenumber;
  }

}
