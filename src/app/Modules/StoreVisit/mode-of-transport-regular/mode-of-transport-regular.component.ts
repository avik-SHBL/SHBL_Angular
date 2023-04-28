import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { StoreVisitService } from '../store-visit.service';
import { AuthorizeService } from '../../../Shared/authorize.service';
import { Constants } from '../../../Shared/constants';
import { ParseJsonDatePipe } from '../../../Shared/Pipes/parse-json-date.pipe';
import { CommonFunc } from '../../../Shared/commonFunc';

@Component({
  selector: 'app-mode-of-transport-regular',
  templateUrl: './mode-of-transport-regular.component.html',
  styleUrls: ['./mode-of-transport-regular.component.css'],
  providers: [ParseJsonDatePipe]
})
export class ModeOfTransportRegularComponent implements OnInit {

    ModeOfTransport:number=0;
    RevenueOfficerList : any = [];
    RMWisePincodeList:any=[];
    Keyword : string = '';
    MemberID:any;
    Name:string='';
    PinCode:string='';
    ModalForRM: string = 'none';
    UserID : any = '';

    EffectDate:any;
    dt = new Date();
    Fday = new Date(this.dt.getFullYear(), 3, 1);



  constructor(private storeVisitService: StoreVisitService,
  	private datePipe: DatePipe,
    private parseJsonDatePipe: ParseJsonDatePipe,
    private authorizeService: AuthorizeService) { }

  ngOnInit(): void {

    this.authorizeService.AuthorizeUserByRole('RetailerShaktiStoreVisitAdmin').subscribe(
      (res) => {
        // console.log(res);
        if(!res){
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


    this.EffectDate = this.datePipe.transform(this.Fday,'yyyy-MM-dd');

    this.GetRMList();

  }

  // ============Start 14-12-2022=============


  GetRMList() {
    this.storeVisitService.GetRMList(this.Keyword).subscribe((res) => {
      // console.log(res);
      if (res != null) {
        this.RevenueOfficerList = res;
        if(res.length == 1) { this.UserID = res[0].MemberID; }
      }
    }, (err: any) => {
      CommonFunc.handleError(err);
    })
      }

      openModalPopup() {
        this.ModalForRM = 'block';
        this.GetRMList();
      }

      closeModalPopup() {
        this.ModalForRM = 'none';
      }

      GetSelectedItem(MemberID,FirstName){
        this.MemberID=  MemberID;
        this.Name=FirstName;
        this.ModalForRM = "none";
      }

      Save() {
        if(this.Validation()) {
        this.storeVisitService.TransportModeRegular_Insert(this.MemberID,this.ModeOfTransport,this.EffectDate).subscribe(
         (res) => {
           this.GetRMList();
           this.MemberID=  '';
           this.Name='';
           this.ModeOfTransport=0;
         });
          }
        }

        Validation() {

          if(this.Name == '') {

            return false;
          }

          return true;
        }


  // ============End 14-12-2022===============

}
