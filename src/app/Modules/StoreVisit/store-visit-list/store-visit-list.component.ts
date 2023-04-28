import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { StoreVisitService } from '../store-visit.service';
import { AuthorizeService } from '../../../Shared/authorize.service';
import { Constants } from '../../../Shared/constants';
import { ParseJsonDatePipe } from '../../../Shared/Pipes/parse-json-date.pipe';
import { CommonFunc } from '../../../Shared/commonFunc';

@Component({
  selector: 'app-store-visit-list',
  templateUrl: './store-visit-list.component.html',
  styleUrls: ['./store-visit-list.component.css'],
  providers: [ParseJsonDatePipe]
})
export class StoreVisitListComponent implements OnInit {	

	Keyword:string = '';
	StoreVisitList:any = [];
  StartDate:any;
  dt = new Date();
  Fday = new Date(this.dt.getFullYear(), this.dt.getMonth(), 1);
  EndDate:any;
  CurDate: any;
  page: number = 1;

  myPopup="none";
  StoreVisitPhoto: string = '';
  ShowImgURL: string = '';
  StoreName: string = '';
  UploadPicURL = Constants.apiURL;  

  constructor(private storeVisitService: StoreVisitService,
  	private datePipe: DatePipe,
    private parseJsonDatePipe: ParseJsonDatePipe,
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

    this.StartDate = this.datePipe.transform(new Date(),'yyyy-MM-dd');

    this.EndDate =  this.datePipe.transform(new Date(),'yyyy-MM-dd');

  	this.PopulateStoreVisitGrid();
  }

  PopulateStoreVisitGrid() {
  	//console.log(this.StartDate, this.EndDate, this.Keyword);
  	this.storeVisitService.GetStoreVisitList(this.StartDate, this.EndDate, this.Keyword).subscribe(
      (res) => {
        // console.log(res.length);        
        this.StoreVisitList = res;
      }, (err: any) => {
        CommonFunc.handleError(err);
      }
    );
  }

  GetPic (StoreVisitPhoto:string , StoreName: string) {
    // console.log(StoreVisitPhoto, StoreName);
   this.myPopup = "block";
   // console.log(this.myPopup);
   this.StoreVisitPhoto = StoreVisitPhoto;

   this.ShowImgURL = this.UploadPicURL + this.StoreVisitPhoto;
   this.StoreName = StoreName;
  }

  closePopup() {
  this.myPopup = "none";
  }

  Delete(StoreVisitID: number) {

    if(confirm('Are you sure that you want to delete this record?')) {
      this.storeVisitService.DeleteStoreVisitById(StoreVisitID).subscribe(
        (res) => {
          // console.log(res); 
          this.PopulateStoreVisitGrid();
        }, (err: any) => {
        CommonFunc.handleError(err);
      });
    }
  }

  onPageChange(pagenumber) {
    // console.log(val);
    this.page = pagenumber;
  }

}
