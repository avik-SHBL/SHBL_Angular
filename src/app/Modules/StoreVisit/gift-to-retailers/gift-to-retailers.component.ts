import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { StoreVisitService } from '../store-visit.service';
import { AuthorizeService } from '../../../Shared/authorize.service';
import { Constants } from '../../../Shared/constants';
import { ParseJsonDatePipe } from '../../../Shared/Pipes/parse-json-date.pipe';
import { CommonFunc } from '../../../Shared/commonFunc';

import {
  DataUrl,
  DOC_ORIENTATION,
  NgxImageCompressService,
  UploadResponse,
} from 'ngx-image-compress';

@Component({
  selector: 'app-gift-to-retailers',
  templateUrl: './gift-to-retailers.component.html',
  styleUrls: ['./gift-to-retailers.component.css'],
  providers: [ParseJsonDatePipe]
})
export class GiftToRetailersComponent implements OnInit {

  constructor(private storeVisitService: StoreVisitService,
    private datePipe: DatePipe,
    private parseJsonDatePipe: ParseJsonDatePipe,
    private authorizeService: AuthorizeService,
    private imageCompress: NgxImageCompressService
    ) { }
  
  UploadPicURL = Constants.apiURL + "/BrandingUploadedDocs/RetailerShakti_Uploads/";  
  ShowImgURL:string='';
  IsGiven = 0;
  Heading:string='';
  Keyword:string='';
  GiftToRetailersList:any = [];
  StoreName:string='';
  StoreVisitID:number=0;
  GiftToRetailerPic:string='';
  StoreVisit_ID:number=0;
  ModalUploadPic = "none";
  myPopup="none";

  Time : string ='';
  Date : string='';
  GiftGivenDate :string='';
  GiftGivenTime :string='';
  Filename :string='';
  selectedFiles?: FileList;
  PhotoUrl: string = '';

  page: number = 1;

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

    this.PopulateGrid();

  }

  ChangeStatus(e){

  // console.log(e.target.value);
  this.IsGiven = e.target.value;
  this.PopulateGrid();

  }

  PopulateGrid () {

    if (this.IsGiven == 0) {

        this.Heading = 'Upload Pic';
    }
    else {

        this.Heading = 'View Pic';
    }

    this.storeVisitService.GiftToRetailers(this.Keyword,this.IsGiven).subscribe(
      (res) => {
        // console.log(res);        
        this.GiftToRetailersList = res;
      }, (err: any) => {
        CommonFunc.handleError(err);
      }
    );
  }

  GetPic (GiftToRetailerPic:string , StoreName: string) {
   
   // console.log(this.myPopup);
   this.myPopup = "block";
   // console.log(this.myPopup);
   this.GiftToRetailerPic = GiftToRetailerPic;

   this.ShowImgURL = this.UploadPicURL + this.GiftToRetailerPic;
   this.StoreName = StoreName;

  // $('#myPopup').modal('show');

  }

  UploadGiftToRetailerPic (StoreVisitID: number) {

  this.StoreVisit_ID = StoreVisitID;
  // $('#ModalUploadPic').modal('show');
  this.ModalUploadPic = "block";

  }

  openPopup() {

  this.ModalUploadPic = "block";

  }

  closePopup() {

  this.ModalUploadPic = "none";
  this.myPopup = "none";

  }

  // GiftRetailerPic(event:any) {

  //   this.selectedFiles = event.target.files;

  //   if (this.selectedFiles) {
  //     for (let i = 0; i < this.selectedFiles.length; i++) {
  //       this.storeVisitService.uploadFile(this.selectedFiles[i]).subscribe(
  //         (res) => {
  //           // console.log(res);
  //           this.Filename = res.body;
  //         }, (err: any) => {
  //       CommonFunc.handleError(err);
  //     })
  //     }
  //   } 
  // }

  GiftRetailerPic(event:any) {

    this.selectedFiles = event.target.files;

    if (this.selectedFiles) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        var fileName  = event.target.files[i]['name'];

        var reader = new FileReader();
        reader.onload = (event: any) => {
          var localUrl = event.target.result;
          
          this.compressFile_GiftRetailerPic(localUrl, fileName);
        }
        reader.readAsDataURL(event.target.files[i]);

      }
    } 
  }

  UpdateGift() {

    this.Time = this.GiftGivenTime;
    this. Date = this.GiftGivenDate;

    if (this.GiftGivenDate == null) 
    { 
      alert('Please enter date'); 
      // return false; 
    }
    else {
      this.storeVisitService.GiftToRetailer_Update(this.StoreVisit_ID,this.Filename,this.Date,this.Time).subscribe(
        (res) => {
          // console.log(res); 
          this.closePopup();   
          (<HTMLInputElement> document.getElementById('UploadPic_GiftPending')).value = '';
          this.GiftGivenDate = '';
          this.GiftGivenTime = '';       
          this.PopulateGrid();
        }, (err: any) => {
        CommonFunc.handleError(err);
      }
      );
    }
  }

  // SelectPicFile(event, StoreVisitID, GiftGivenDate, GiftGivenTime) {

  //   // console.log(event, StoreVisitID, this.parseJsonDatePipe.transform(GiftGivenDate), GiftGivenTime);

  //   this.selectedFiles = event.target.files;

  //   if (this.selectedFiles) {
  //     for (let i = 0; i < this.selectedFiles.length; i++) {
  //       this.storeVisitService.ChangePic(this.selectedFiles[i], StoreVisitID, this.parseJsonDatePipe.transform(GiftGivenDate), GiftGivenTime).subscribe(
  //         (res) => {
  //           // console.log(res);
  //           this.Filename = res.body;
  //           this.PopulateGrid();
  //         }, (err: any) => {
  //       CommonFunc.handleError(err);
  //     })
  //     }
  //   }     

  // }

  SelectPicFile(event, StoreVisitID, GiftGivenDate, GiftGivenTime) {
    // console.log(event.target.files, StoreVisitID, this.parseJsonDatePipe.transform(GiftGivenDate), GiftGivenTime);

    this.selectedFiles = event.target.files;

    if (this.selectedFiles) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        var fileName  = event.target.files[i]['name'];

        var reader = new FileReader();
        reader.onload = (event: any) => {
          var localUrl = event.target.result;          
          this.compressFile_SelectPicFile(localUrl, fileName, StoreVisitID, GiftGivenDate, GiftGivenTime);
        }
        reader.readAsDataURL(event.target.files[i]);
      }
    }     

  }


// Create Blob file from URL
blobCreationFromURL(inputURI) {

  var arr = inputURI.split(','), mime = arr[0].match(/:(.*?);/)[1],
  bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  while(n--){
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], {type:mime});
}

compressFile_GiftRetailerPic(image, fileName) {
  // console.log(image, fileName);

  var orientation = -1;
  
  this.imageCompress.compressFile(image, orientation, 50, 50).then(
    (result: DataUrl) => {

      const imageBlob = this.blobCreationFromURL(result);

      const imageFile = new File([imageBlob], fileName);
      //console.log(imageFile);

      this.storeVisitService.uploadFile(imageFile).subscribe(
        (res) => {
          // console.log(res);
          this.Filename = res.body;
          //location.href = 'Home/StoreVisitList';
        }, (err: any) => {
          CommonFunc.handleError(err);
        })

    });
  
}

compressFile_SelectPicFile(image, fileName, StoreVisitID, GiftGivenDate, GiftGivenTime) {
  // console.log(image, fileName);

  var orientation = -1;
  
  this.imageCompress.compressFile(image, orientation, 50, 50).then(
    (result: DataUrl) => {

      const imageBlob = this.blobCreationFromURL(result);

      const imageFile = new File([imageBlob], fileName);
      //console.log(imageFile);

      this.storeVisitService.ChangePic(imageFile, StoreVisitID, this.parseJsonDatePipe.transform(GiftGivenDate), GiftGivenTime).subscribe(
        (res) => {
          // console.log(res);
          this.Filename = res.body;
          this.PopulateGrid();
          //location.href = 'Home/StoreVisitList';
        }, (err: any) => {
          CommonFunc.handleError(err);
        })

    });
  
}
  onPageChange(pagenumber) {
    // console.log(val);
    this.page = pagenumber;
  }


}
