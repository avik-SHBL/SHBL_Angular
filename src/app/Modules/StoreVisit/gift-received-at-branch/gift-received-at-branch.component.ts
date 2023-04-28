import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AuthorizeService } from '../../../Shared/authorize.service';
import { Constants } from '../../../Shared/constants';
import { StoreVisitService } from '../store-visit.service';
import { GiftReceivedAtBranchModel } from '../gift-received-at-branch/gift-received-at-branch';
import { ParseJsonDatePipe } from '../../../Shared/Pipes/parse-json-date.pipe';
import { CommonFunc } from '../../../Shared/commonFunc';

@Component({
  selector: 'app-gift-received-at-branch',
  templateUrl: './gift-received-at-branch.component.html',
  styleUrls: ['./gift-received-at-branch.component.css'],
  providers: [ParseJsonDatePipe]
})
export class GiftReceivedAtBranchComponent implements OnInit {

  StartDate:any;

  dt = new Date();
  Fday = new Date(this.dt.getFullYear(), this.dt.getMonth(), 1);

  EndDate:any;

  CurDate: any;

  GiftReceivedByBranchList: any = [];

  GiftReceivedAtBranch: any = {};

  ModalGiftReceivedAtBranchEntry: string = 'none';

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

    this.GiftReceivedAtBranch.ReceiveDate = this.datePipe.transform(new Date(),'yyyy-MM-dd');

    this.PopulateGrid();

  }

  PopulateGrid() {
    //console.log(this.StartDate, this.EndDate, this.Keyword);
    this.GiftReceivedByBranchList = [];
    if(this.StartDate != '' && this.EndDate != '') {
      this.storeVisitService.GetGiftReceivedAtBranchList(this.StartDate, this.EndDate).subscribe(
        (res) => {
          // console.log(res);        
          this.GiftReceivedByBranchList = res;
        }, (err: any) => {
        CommonFunc.handleError(err);
      }
        );    
    }

  }

  getToday(): string {
    return new Date().toISOString().split('T')[0];
  }

  Delete(ReceiptID) {

    if(confirm('Are you sure that you want to delete this particular record?')) {
      this.storeVisitService.GiftReceivedAtBranch_Delete(ReceiptID).subscribe(
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

    this.GiftReceivedAtBranch.SessionToken = localStorage.getItem('token');

    // console.log(this.GiftReceivedAtBranch.ReceiveDate, this.GiftReceivedAtBranch.Quantity);
    if(this.GiftReceivedAtBranch.ReceiveDate != '' && this.GiftReceivedAtBranch.Quantity != undefined) {
      this.storeVisitService.GiftReceivedAtBranch_Insert(this.GiftReceivedAtBranch).subscribe(
        (res) => {
          // console.log(res);
          this.closeGiftReceivedAtBranchEntryPopup();
          this.PopulateGrid();
        }, (err: any) => {
        CommonFunc.handleError(err);
      });
    }

  }

  openGiftReceivedAtBranchEntryPopup() {

    this.ModalGiftReceivedAtBranchEntry = 'block';

  }

  closeGiftReceivedAtBranchEntryPopup() {

    this.ModalGiftReceivedAtBranchEntry = 'none';

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
