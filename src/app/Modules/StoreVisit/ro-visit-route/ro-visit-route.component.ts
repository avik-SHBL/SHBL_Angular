import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';

import { StoreVisitService } from '../store-visit.service';
import { InputJsonDatePipe } from '../../../Shared/Pipes/input-json-date.pipe';
import { AuthorizeService } from '../../../Shared/authorize.service';
import { Constants } from '../../../Shared/constants';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { ParseJsonDatePipe } from '../../../Shared/Pipes/parse-json-date.pipe';
import { CommonFunc } from '../../../Shared/commonFunc';

@Component({
  selector: 'app-ro-visit-route',
  templateUrl: './ro-visit-route.component.html',
  styleUrls: ['./ro-visit-route.component.css'],
  providers: [ParseJsonDatePipe]
})
export class RoVisitRouteComponent implements OnInit {

	RoVisit: any = {};
  Keyword:string = '';
  StartDate:any;
  dt = new Date();
  Fday = new Date(this.dt.getFullYear(), this.dt.getMonth(), 1);
  EndDate:any;
  CurDate: any;

  RevenueOfficerList : any = [];
  UserID : any = '';
  submitted = false;
  RMVisitRouteList : any =[];
  URL_LatLang :any='';
  VisitDate : any='';
  //page: number = 1;
  stringifiedData:any;

  myPopup="none";
  StoreVisitPhoto: string = '';
  ShowImgURL: string = '';
  StoreName: string = '';
  UploadPicURL = Constants.apiURL;
  IsExpanded = '+';

  constructor(private storeVisitService: StoreVisitService,
    private activatedRoute:ActivatedRoute,
    private datePipe: DatePipe,
    private inputJsonDatePipe: InputJsonDatePipe,
    private authorizeService: AuthorizeService,
    private fb: FormBuilder,
    private parseJsonDatePipe: ParseJsonDatePipe) { }

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

      this.CurDate = this.datePipe.transform(new Date(),'dd/MM/yyyy');

      this.StartDate = this.datePipe.transform(new Date(),'yyyy-MM-dd');

      this.EndDate =  this.datePipe.transform(new Date(),'yyyy-MM-dd');
      this.UserID=0;
      this.PopulateGrid();

      this.GetRMList();

  }

  PopulateGrid() {

    this.storeVisitService.RMVisitRoute_List(this.StartDate, this.EndDate, this.Keyword,this.UserID).subscribe(
      (res) => {
        this.RMVisitRouteList = res;
      }, (err: any) => {
        CommonFunc.handleError(err);
      }
    );
  }

  GetRMList() {
    this.storeVisitService.GetRMList(this.Keyword).subscribe(
      (res) => {
        console.log(res);
        this.RevenueOfficerList = res;
        if(res.length == 1) {
          this.UserID = res[0].MemberID;
        }
      }, (err: any) => {
        CommonFunc.handleError(err);
      }
      );
  }

  // onPageChange(pagenumber) {
  //   // console.log(val);
  //   this.page = pagenumber;
  // }

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

  ShowMapPath = function (VisitDate,MemberID) {
    this.storeVisitService.RMVisitRoute_Path(VisitDate,MemberID).subscribe(
     (res) => {
        this.URL_LatLang = res[0].URL_LatLang;

        var width = screen.width * 70 / 100;
        var height = screen.height * 60 / 100;
        var left = (screen.width - width) / 2;
        var top = (screen.height - height) / 4;
        var windowHandle;
        if (windowHandle) {
            windowHandle.close();
        }
        windowHandle = window.open(this.URL_LatLang, '_blank', 'left=' + left + ',top=' + top + ',minimizable=no,scrollbars=no,resizable=no,titlebar=no,toolbar=no,statusbar=no,location=yes,height=' + height + ',width=' + width + ',scrollbars=yes,status=yes');
      }, (err: any) => {
        CommonFunc.handleError(err);
      }
    );
}

ShowMap = function (Lattittude, Longitude) {
  var LatLon = Lattittude + '+' + Longitude;
  // console.log(Lattittude);

  var width = screen.width * 70 / 100;
  var height = screen.height * 60 / 100;
  var left = (screen.width - width) / 2;
  var top = (screen.height - height) / 4;
  var windowHandle;

  if (windowHandle) {
      windowHandle.close();
  }
  windowHandle = window.open('https://www.google.com/maps/place/' + LatLon, '_blank', 'left=' + left + ',top=' + top + ',minimizable=no,scrollbars=no,resizable=no,titlebar=no,toolbar=no,statusbar=no,location=yes,height=' + height + ',width=' + width + ',scrollbars=yes,status=yes');

}

// Start 25-11-2022
onChange_VisitKm(Km, MemberID, VisitDate) {
  // console.log(km, MemberID, this.parseJsonDatePipe.transform(VisitDate));
  this.storeVisitService.InsertVisitKm(Km, MemberID, this.parseJsonDatePipe.transform(VisitDate)).subscribe(
   (res) => {
     // console.log(res);
     this.PopulateGrid();
   });
}

Expand_CollapseCell() {
    // alert(this.IsExpanded);
    if(this.IsExpanded == '+') {
      this.IsExpanded = '-';
    }
    else {
      this.IsExpanded = '+';
    }

  }

// End 25-11-2022
}
