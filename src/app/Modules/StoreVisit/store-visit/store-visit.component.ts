import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { StoreVisitService } from '../store-visit.service';
import { StoreVisit } from '../store-visit/store-visit';
import { InputJsonDatePipe } from '../../../Shared/Pipes/input-json-date.pipe';
import { AuthorizeService } from '../../../Shared/authorize.service';
import { Constants } from '../../../Shared/constants';
import { CommonFunc } from '../../../Shared/commonFunc';
//------------internet------------------
import { fromEvent, merge, Observable, of, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
//-------------------------------------
import {
  DataUrl,
  DOC_ORIENTATION,
  NgxImageCompressService,
  UploadResponse,
} from 'ngx-image-compress';

import { CompressImageService } from '../../../Shared/compress-image.service';
import { take } from 'rxjs/operators';


@Component({
  selector: 'app-store-visit',
  templateUrl: './store-visit.component.html',
  styleUrls: ['./store-visit.component.css']
})
export class StoreVisitComponent implements OnInit {


  //------internet check------
  networkStatus: boolean = false;
  networkStatus$: Subscription = Subscription.EMPTY;
  //---------------------------

	StoreVisit: any = {};
  DistrictList:any = [];

  StoreVisitForm;
  submitted = false;

  lblForLocation: string = '';
  // disableSaveBtn: boolean = false; 
  LoadingText: string = '';
  //selectedFiles?: FileList; 
  Filename: string = '';
  SaveStatus: number = 0;
  imgResultAfterCompress: DataUrl = '';
  element: HTMLElement;
  myPopup="none";
  Search:string='';
  HeadingText:string='';
  VisitedStoreMasterSelectAll:any=[];
  results: any = [];
  showHideSubmitBtn = true;
  Lead_ID: number =0;
  showChainStorePopup = 'none';
  isSaved = false;

  imageSrc: string;
  image: File;
  aftercomprssedImg: any;
  isloading: boolean = false;
  imgLoading: boolean = false;

  constructor(private storeVisitService: StoreVisitService, 
    private activatedRoute:ActivatedRoute,
    private datePipe: DatePipe,
    private inputJsonDatePipe: InputJsonDatePipe,
    private authorizeService: AuthorizeService,
    private fb: FormBuilder,
    private imageCompress: NgxImageCompressService,
    private compressImage: CompressImageService,
    private router: Router
    ) { }

  ngOnInit(): void {
  //------internet check------
    //this.checkNetworkStatus();
//----------------------------
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
    
  	this.GetDistrict();   

    this.GetLocation();

    this.StoreVisitForm = this.fb.group({
      VisitDate: [this.datePipe.transform(new Date(),'yyyy-MM-dd'), Validators.required],
      Location: ['', Validators.required],
      District: ['', Validators.required],
      PinCode: ['', Validators.required],
      StoreName: ['', Validators.required],
      StoreOpeningTime: [''],
      StoreClosingTime: [''],
      AfternoonClosingTime: [''],
      AfternoonOpeningTime: [''],
      StoreClosedOn: ['', Validators.required],
      ContactPerson: [''],
      ContactNo: [''],
      Lattitude: [''],
      Longitude: [''],
      ShortRemark: ['', Validators.required],
      Revisit: [''],
      RevisitDate: [''],
      DetailRemark: [''],
      Feedback: [''],
      VisitedBefore:[''],
      IsChainStore: [''],
      NoOfStores: [''],
      MappedChainStore: [''],
      MappedChainStoreName: [''],
      TypeOfCustomer: ['', Validators.required],
      DailyAveragePurchase: [''],
      DailyPurchaseUnit: ['thousand'],
      ExistingPurchaseDiscount: [''],
      LeadID:['']
    });

    if(this.activatedRoute.snapshot.params.StoreVisitID != undefined ){
      this.StoreVisitForm.value.StoreVisitID = this.activatedRoute.snapshot.params.StoreVisitID;
      this.PopulateInputValues(this.activatedRoute.snapshot.params.StoreVisitID);
      this.showHideSubmitBtn = false;
    }
    if(this.activatedRoute.snapshot.params.LeadID != undefined ){
      this.Lead_ID=this.activatedRoute.snapshot.params.LeadID;
      this.StoreVisitForm.value.LeadID = this.activatedRoute.snapshot.params.LeadID;

      this.StoreVisitForm.patchValue({
        LeadID:this.Lead_ID
      });

      this.PopulateInputValuesFromLead(this.activatedRoute.snapshot.params.LeadID);

      this.showHideSubmitBtn = true;

    }

  }

  ngOnDestroy(): void {
    this.networkStatus$.unsubscribe();
  }

  // checkNetworkStatus() {
  //   this.networkStatus = navigator.onLine;
  //   this.networkStatus$ = merge(
  //     of(null),
  //     fromEvent(window, 'online'),
  //     fromEvent(window, 'offline')
  //   )
  //     .pipe(map(() => navigator.onLine))
  //     .subscribe(status => {
  //       console.log('status', status);
  //       this.networkStatus = status;
  //       if(this.networkStatus==false)
  //       {alert("You are Offline.");}
  //     });
  // }
  
  get f() { return this.StoreVisitForm.controls; }

  getToday(): string {
    return new Date().toISOString().split('T')[0]
  }

  GetDistrict() {
    this.storeVisitService.GetDistrict().subscribe(
      (res) => {
        // console.log(res);
        this.DistrictList = res;
      }, (err: any) => {
        CommonFunc.handleError(err);
      }
    );
  }  

  GetLocation = function () {
    // console.log(navigator.geolocation);
    if (navigator.geolocation) {
      const pos = document.getElementById('lblForLocation') as HTMLElement;
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          // console.log("Latitude: " + position.coords.latitude +", Longitude: " + position.coords.longitude);
          this.StoreVisitForm.patchValue({
            'Lattitude' : position.coords.latitude,
            'Longitude' : position.coords.longitude
          });
          pos.innerHTML = '';    
        },
        (err: GeolocationPositionError) => {
          // console.log('Err:' +err);
          switch (err.code) {
            case err.PERMISSION_DENIED:
            //x.innerHTML = "User denied the request for Geolocation."                
            pos.innerHTML = 'You have blocked location access, please allow from Site settings > Location';            
            // this.disableSaveBtn = true;  
            break;
            case err.POSITION_UNAVAILABLE:
            //x.innerHTML = "Location information is unavailable."
            break;
            case err.TIMEOUT:
            //x.innerHTML = "The request to get user location timed out."
            break;
            //case err.UNKNOWN_ERROR:
            //x.innerHTML = "An unknown error occurred."
            //break;
          }
        }
      //   {
      //     enableHighAccuracy: true,
      //     timeout: 3000,
      //     maximumAge: 60000,
      //   }
        );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }

  PopulateInputValues(StoreVisitID:number) { 
    this.storeVisitService.GetStoreVisitById(StoreVisitID).subscribe(
      (res) => {
        // console.log(res);
        this.StoreVisitForm = this.fb.group({
          VisitDate: this.inputJsonDatePipe.transform(res[0].VisitDate),
          Location: res[0].Location,
          District: res[0].District,
          PinCode: res[0].PinCode,
          StoreName: res[0].StoreName,
          StoreOpeningTime: res[0].StoreOpeningTime,
          StoreClosingTime: res[0].StoreClosingTime,
          AfternoonClosingTime: res[0].AfternoonClosingTime,
          AfternoonOpeningTime: res[0].AfternoonOpeningTime,
          StoreClosedOn: res[0].StoreClosedOn,
          ContactPerson: res[0].ContactPerson,
          ContactNo: res[0].ContactNo,
          ShortRemark: res[0].ShortRemark,
          Revisit: res[0].Revisit != null ? res[0].Revisit : '',
          RevisitDate: res[0].RevisitDate != null ? this.inputJsonDatePipe.transform(res[0].RevisitDate) : '',
          DetailRemark: res[0].DetailRemark,
          Feedback: res[0].Feedback,
          VisitedBefore:res[0].VisitedBefore==0?false:true, 
          IsChainStore: res[0].IsChainStore == 0 ? false : true,
          NoOfStores: res[0].NoOfStores,
          MappedChainStore: res[0].MappedChainStore,
          MappedChainStoreName: res[0].MappedStoreName,
          TypeOfCustomer: res[0].TypeOfCustomer == null ? '' : res[0].TypeOfCustomer,
          DailyAveragePurchase: res[0].DailyAveragePurchase,
          DailyPurchaseUnit: res[0].DailyPurchaseUnit == null ? 'thousand' : res[0].DailyPurchaseUnit,
          ExistingPurchaseDiscount: res[0].ExistingPurchaseDiscount,
        });

        // console.log(this.StoreVisitForm.value);

      }, (err: any) => {
        CommonFunc.handleError(err);
      }
    );
  }

  PopulateInputValuesFromLead(LeadID) {
 
    this.storeVisitService.InputValuesFromLead(LeadID).subscribe(
      (res) => {   
        this.StoreVisitForm.patchValue({
        Location: res[0].Location,
        District: res[0].DistrictID,
        PinCode: res[0].Pin_Code,
        StoreName: res[0].ShopName,
        StoreOpeningTime: res[0].StoreOpeningTime,
        StoreClosingTime: res[0].StoreClosingTime,
        AfternoonClosingTime: res[0].AfternoonClosingTime,
        AfternoonOpeningTime: res[0].AfternoonOpeningTime,
        StoreClosedOn: res[0].StoreClosedOn,
        ContactPerson: res[0].ProprietorName,
        ContactNo: res[0].ContactNumber1,
        ShortRemark: res[0].ShortRemark,
        Revisit: res[0].Revisit != null ? res[0].Revisit : '',
        RevisitDate: res[0].RevisitDate != null ? this.inputJsonDatePipe.transform(res[0].RevisitDate) : '',
        DetailRemark: res[0].DetailRemark,
        Feedback: res[0].Feedback,
        VisitedBefore:res[0].VisitedBefore==undefined|| res[0].VisitedBefore==null?false:true
        // IsChainStore: false,
        // NoOfStores: res[0].NoOfStores,
        // MappedChainStore: res[0].MappedChainStore, 
        // TypeOfCustomer: res[0].TypeOfCustomer == null ? '' : res[0].TypeOfCustomer,
        // DailyAveragePurchase: res[0].DailyAveragePurchase,
        // DailyPurchaseUnit: 'thousand',
        // ExistingPurchaseDiscount: res[0].ExistingPurchaseDiscount,

 
        });
      }, (err: any) => {
        CommonFunc.handleError(err);
      }
    );
  }

  onChangeRevisit() {
    // console.log(this.StoreVisitForm.value.Revisit);
    if(this.StoreVisitForm.value.Revisit == '' && this.StoreVisitForm.value.RevisitDate != '') {
      this.StoreVisitForm.patchValue({'RevisitDate':''});
    }
  }

  onChangeRevisitDate() {
    // console.log(this.StoreVisitForm.value.RevisitDate);
    if(this.StoreVisitForm.value.RevisitDate == '') {
      this.StoreVisitForm.patchValue({'Revisit':''});
    }
  }

  ValidateFields() {

    if(this.StoreVisitForm.value.Revisit != '' && this.StoreVisitForm.value.RevisitDate == '') {
      alert('Please specify revisit date.');      
      return false;
    }
    if (this.StoreVisitForm.value.IsChainStore && this.StoreVisitForm.value.NoOfStores == '') {
      alert('Please specify number of stores.');
      return false;
    }
    if (this.StoreVisitForm.value.ShortRemark == 'ON BOARD' || this.StoreVisitForm.value.ShortRemark == 'Activation Done') {
      if(this.StoreVisitForm.value.ContactNo==undefined || this.StoreVisitForm.value.ContactNo==null || this.StoreVisitForm.value.ContactNo== ''){
        alert('Please provide Contact No.');
        return false;
      }
    }
    return true;
  }

  AddStoreVisit(StoreVisit: any) {
    // console.log(StoreVisit);
    StoreVisit.SessionToken = localStorage.getItem('token');
    this.storeVisitService.AddStoreVisit(StoreVisit).subscribe(
      (res:any) => {
        // console.log(res.Data);
  
        if(res.Data!=null && res.Data!=undefined && res.Data != 0) {
          this.SaveStatus = 1;
          localStorage.setItem('StoreVisitID', res.Data); 
          this.StoreVisitForm.value.StoreVisitID = res.Data;
          alert('Record saved. Take store picture now!'); 
          //location.href = 'Home/StoreVisitList';
        }
      }, (err: any) => {
        CommonFunc.handleError(err);
      }
    );
  }

  UpdateStoreVisit(StoreVisit: any) {
    StoreVisit.SessionToken = localStorage.getItem('token');
    this.storeVisitService.UpdateStoreVisit(StoreVisit).subscribe(
      (res:any) => {
        // console.log(res);
        if(res.Message == '') {
          alert('Store visit details updated successfully.');
          location.href = 'Home/StoreVisitList';
        }
      }, (err: any) => {
        CommonFunc.handleError(err);
      }
    );
  }

  Save(): void {

 
     if(this.StoreVisitForm.value.Lattitude != null && this.StoreVisitForm.value.Longitude != undefined && this.StoreVisitForm.value.Longitude != "") 
     {
      this.submitted = true;

      if (this.StoreVisitForm.invalid) {
        return;
      }

      if(this.ValidateFields()) {

        if(this.activatedRoute.snapshot.params.StoreVisitID != undefined && this.activatedRoute.snapshot.params.StoreVisitID>0) { 
           
          this.StoreVisitForm.value.StoreVisitID = this.activatedRoute.snapshot.params.StoreVisitID;     
          this.UpdateStoreVisit(this.StoreVisitForm.value);
        }
        else{
          
          this.AddStoreVisit(this.StoreVisitForm.value); 
                
        }  
        
      }
     }
     else { alert('You have blocked location access, please allow it from Site settings > Location Or Clear browsing data & Re-Login.'); }
  }  

  /*CameraCapture(event) {
    // console.log(event, this.StoreVisitForm.value);
    //this.selectedFile = event.target.files[0];
    //alert(event.target.files[0].name);
    if(this.networkStatus==false)
    {alert("You are Offline.");}

    var fileName = event.target.files[0]['name'];

    if (event.target.files && event.target.files[0]) {
      this.LoadingText = 'Uploading...Please wait! Do not close or change page.';

      var reader = new FileReader();
      reader.onload = (event: any) => {
        var localUrl = event.target.result;
        this.compressFile(localUrl,fileName);
      }
      reader.readAsDataURL(event.target.files[0]);
      //alert('readAsDataURL...');
      //console.log('DataURL :'+ JSON.stringify( event.target.files[0]));
    }

  }
    
  compressFile(image, fileName) {
    this.LoadingText = 'Compressing Picture...';
    //alert('Uploading Picture...');
    var orientation = -1;     
      this.imageCompress.compressFile(image, orientation, 50, 50).then(
        (result:DataUrl) => {
          this.LoadingText = 'Uploading Picture...';
          // this.imgResultAfterCompress=result;           
          const imageBlob = this.blobCreationFromURL(result);
          const imageFile = new File([imageBlob], fileName);  
          //console.log(imageFile);  
          this.storeVisitService.CapturePic(imageFile, this.StoreVisitForm.value.StoreVisitID).subscribe(
            (res) => {
              // console.log(res);
              setTimeout(()=>{
              this.Filename = res.body;
              if (res.body!=null && res.body!=undefined && res.body!=''){
                this.imgResultAfterCompress=result; 
              this.LoadingText = 'Picture Uploaded!';
              console.log(res);
                }
            }, 2000);
            }, (err: any) => {
              CommonFunc.handleError(err);
            })
  
        }
        );
      
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



  UploadPicture(event) {
    this.LoadingText = 'Uploading...Please wait! Do not close or change page.';


if (event.target.files[0]) {

   this.storeVisitService.CapturePic(event.target.files[0], this.StoreVisitForm.value.StoreVisitID).subscribe(
    (res) => {
      // console.log(res);
       this.Filename = res.body;
      this.LoadingText = 'Picture Uploaded!';
       //setTimeout(function () { this.RedirectToListPage(); }, 1500);
       //location.href = 'Home/StoreVisitList';
     }, (err: any) => {
   CommonFunc.handleError(err);
 })
 
} 
}*/

RedirectToListPage() {
alert('Photo uploaded!');
location.href = 'Home/StoreVisitList';
}

GetStorePreRecords(){

  this.VisitedStoreMaster_SelectAll();
  this.myPopup = "block";

}

closePopup() {

  this.myPopup = "none";

}

VisitedStoreMaster_SelectAll() {
  this.storeVisitService.VisitedStoreMaster_SelectAll(this.Search).subscribe((res) => {
    // console.log(res);
    if (res != null) {
      this.VisitedStoreMasterSelectAll = res;
      this.HeadingText='Visited Store List';
    }
  }, (err: any) => {
    CommonFunc.handleError(err);
  })

}


GetSelectedItem(StoreName,Location,PinCode){

    this. results =  this.VisitedStoreMasterSelectAll.filter(element => {

      return element.StoreName === StoreName && element.Location ===Location && element.PinCode ===PinCode;
    });

    this.StoreVisitForm.patchValue({
      Location: this.results[0].Location,
      District: this.results[0].District,
      PinCode: this.results[0].PinCode,
      StoreName: this.results[0].StoreName,
      StoreOpeningTime: this.results[0].StoreOpeningTime,
      StoreClosingTime: this.results[0].StoreClosingTime,
      AfternoonClosingTime: this.results[0].AfternoonClosingTime,
      AfternoonOpeningTime: this.results[0].AfternoonOpeningTime,
      StoreClosedOn: this.results[0].StoreClosedOn,
      ContactPerson: this.results[0].ContactPerson,
      ContactNo: this.results[0].ContactNo
    });

    this.closePopup();

  }


  onChangeVisitedBefore() {
    //console.log(this.StoreVisitForm.value);
    if(this.StoreVisitForm.value.VisitedBefore == '0') {
      this.StoreVisitForm = this.fb.group({
        VisitDate: [this.datePipe.transform(new Date(),'yyyy-MM-dd')],
        Location: [''],
        District: [''],
        PinCode: [''],
        StoreName: [''],
        StoreOpeningTime: [''],
        StoreClosingTime: [''],
        AfternoonClosingTime: [''],
        AfternoonOpeningTime: [''],
        StoreClosedOn: [''],
        ContactPerson: [''],
        ContactNo: [''],
        Lattitude: [''],
        Longitude: [''],
        ShortRemark: [''],
        Revisit: [''],
        RevisitDate: [''],
        DetailRemark: [''],
        Feedback: [''],
        VisitedBefore:['']
      });
    }
  }

  /*---------Upload And Compress Image START---------*/

  // CameraCaptureNEW(event) {
 
  //   this.isSaved = true;
  //   let uploadmsg : any = document.getElementById("dvuploadmsg") as HTMLInputElement | null 
  //   uploadmsg.innerHTML = 'Uploading image... Please wait!';
  //   let image: File = event.target.files[0]
  //   // console.log(`Image size before compressed: ${image.size} bytes.`)

  //   this.compressImage.compress(image)
  //   .pipe(take(1))
  //   .subscribe(compressedImage => {
  //     // console.log(`Image size after compressed: ${compressedImage.size} bytes.`)
  //     // now you can do upload the compressed image 
  //     if(this.StoreVisitForm.value.StoreVisitID == null || this.StoreVisitForm.value.StoreVisitID == undefined ||this.StoreVisitForm.value.StoreVisitID == 0) {
  //       this.StoreVisitForm.value.StoreVisitID=localStorage.getItem('StoreVisitID');
  //     }
  //     if(this.StoreVisitForm.value.StoreVisitID != null && this.StoreVisitForm.value.StoreVisitID != undefined && this.StoreVisitForm.value.StoreVisitID != 0) {
  //       this.storeVisitService.CapturePic(compressedImage, this.StoreVisitForm.value.StoreVisitID).subscribe(
  //         (res) => {
  //            ////alert(res.statusText);
  //            ////alert(res.body);
  //           // console.log(res); 
  //           if(res.statusText == 'OK' && (res.body!=null && res.body!=undefined && res.body!='' )) {
  //               ////alert('inside:' + res.statusText); 
  //               localStorage.removeItem('StoreVisitID');             
  //             setTimeout(() => { this.RedirectToListPage(); }, 6000);
  //           }
            
  //         }, (err: any) => {
  //           CommonFunc.handleError(err);
  //         });
  //     }

  //   });
  // }

  /*---------Upload And Compress Image END---------*/


  onChangeChainStore(event) {
    // console.log(event.target.checked);
    if (!event.target.checked) {
      this.StoreVisitForm.patchValue({
        NoOfStores: [''],
        MappedChainStore: [''],
        MappedChainStoreName: ['']
      })
    }
  }

  showStoreVisitModal() {
    this.showChainStorePopup = 'block';
    this.VisitedStoreMaster_SelectAll();
  }

  GetSelectedChainStore(StoreVisitMasterID, StoreName) {
    // console.log(StoreVisitID, StoreName);
    this.StoreVisitForm.patchValue({
      MappedChainStore: StoreVisitMasterID,
      MappedChainStoreName: StoreName
    })
    this.closeChainStorePopup();
  }

  closeChainStorePopup() {
    this.showChainStorePopup = 'none';
  }

  // populateChainStoreName(id) {
  //   let SName = '';
  //   for (var i = 0; i < this.VisitedStoreMasterSelectAll.length; i++) {
  //     if (this.VisitedStoreMasterSelectAll[i].StoreVisitID == id) {
  //       SName = this.VisitedStoreMasterSelectAll[i].StoreName;
  //     }
  //   }
  //   return SName;
  // }

  canDeactivate(): Observable<boolean> {
    return this.isAllowedNavigation();
  }

  private isAllowedNavigation(): Observable<boolean> {
    if (!this.isSaved && this.submitted == true) {
      const result = window.confirm(`You didn't take store picture... Do you wish to skip?`);
      if(result == true){
        let SkippedUpload = 1;
        // console.log("Pic Id", this.StoreVisitForm.value.StoreVisitID, "Skipped value",SkippedUpload);
        if (this.StoreVisitForm.value.StoreVisitID != null && this.StoreVisitForm.value.StoreVisitID != undefined && this.StoreVisitForm.value.StoreVisitID != 0) {
          this.storeVisitService.IsPhotoSkipped(this.StoreVisitForm.value.StoreVisitID, SkippedUpload).subscribe(
            (res) => {
              // if (res.statusText == 'OK' && (res.body != null && res.body != undefined && res.body != '')) {
              //   localStorage.removeItem('StoreVisitID');
              // }
            }, (err: any) => {
              CommonFunc.handleError(err);
            });
        }
      }
      return of(result);
    }

    return of(true);
  }


  /*StoreImageUpload(event) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      this.imgLoading = true;
      const [file] = event.target.files;
      this.image = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imageSrc = reader.result as string;;
        this.compressImg();
        this.imgLoading = false;
      };
    }
  }

  compressImg() {
    this.compressImage.compress(this.image)
      .pipe(take(1))
      .subscribe(compressedImage => {
        this.aftercomprssedImg = compressedImage;
        ////console.log("comprssedImg", this.aftercomprssedImg);
      });
  }*/


  StoreImageUpload(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      this.imgLoading = true;
      const [file] = event.target.files;
      this.image = event.target.files[0];
      this.compressImg(this.image).then(() => {
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.imageSrc = reader.result as string;;
          // this.compressImg();
          this.imgLoading = false;
        };
      })
    }
  }

  compressImg(img: any) {
    return new Promise<void>((resolve, reject) => {
      this.compressImage.compress(img)
        .pipe(take(1))
        .subscribe(compressedImage => {
          // debugger
          // console.log("compreesed",compressedImage)
          if(compressedImage == undefined || compressedImage == null){
            alert("somthing wrong. please take picture again");
            this.imgLoading = false;
            this.imageSrc = "";
            reject()
          }else{
            this.aftercomprssedImg = compressedImage;
            resolve();
          }
        });
    })
  }


  uploadImage() {
    this.isloading = true;
    this.isSaved = true;
    // console.log(this.aftercomprssedImg);
    if (this.StoreVisitForm.value.StoreVisitID == null || this.StoreVisitForm.value.StoreVisitID == undefined || this.StoreVisitForm.value.StoreVisitID == 0) {
      this.StoreVisitForm.value.StoreVisitID = localStorage.getItem('StoreVisitID');
    }
    if (this.StoreVisitForm.value.StoreVisitID != null && this.StoreVisitForm.value.StoreVisitID != undefined && this.StoreVisitForm.value.StoreVisitID != 0) {
      this.storeVisitService.CapturePic(this.aftercomprssedImg, this.StoreVisitForm.value.StoreVisitID).subscribe(
        (res) => {
          if (res.statusText == 'OK' && (res.body != null && res.body != undefined && res.body != '')) {
            localStorage.removeItem('StoreVisitID');
            // setTimeout(() => { this.RedirectToListPage(); }, 3000);
            alert('Store Image uploaded successfully !');
            this.StoreVisitForm.reset();
            this.imageSrc = "";
            this.router.navigate(['/Home/StoreVisitList']);

          }
        }, (err: any) => {
          CommonFunc.handleError(err);
        });
    }
  }

}
