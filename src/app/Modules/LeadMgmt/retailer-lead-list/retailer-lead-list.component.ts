import { Component, OnInit } from '@angular/core';
import { LeadMgmtService } from '../lead-mgmt.service';
import { CommonFunc } from '../../../Shared/commonFunc';
import * as moment from 'moment';
import { Constants } from '../../../Shared/constants';
import { AuthenticateService } from '../../Authentication/authenticate.service';
import { AuthorizeService } from '../../../Shared/authorize.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-social-media-lead-list',
  templateUrl: './retailer-lead-list.component.html',
  styleUrls: ['./retailer-lead-list.component.css']
})
export class RetailerLeadListComponent implements OnInit {
  
  Keyword:string = '';
  Month:any;
  Year:any;
  IsMapped:any = 0;
  LeadMasterList:any = [];
  Search = '';
  TelecallerPopup: string = 'none';
  TelecallerSearch = '';
  TelecallerList:any = [];
  RMID:any='';
  RMName:string = '';
  masterSelected = false;
  LeadMasterCheckedList:any = [];
  page='';
  RoleExists:any;
  IsReachableBySales = false;

  VisitStatus:number = 0;
  ShortRemark:string = '';
  dt = new Date();
  Fday = new Date(this.dt.getFullYear(), this.dt.getMonth(), 1);
  StartDate:any;
  EndDate:any;


  constructor(private leadMgmtService: LeadMgmtService,
    private authenticateService: AuthenticateService,
    private authorizeService: AuthorizeService,
    private datePipe: DatePipe) { }

  ngOnInit(): void {

    this.authorizeService.AuthorizeUserByRole('RetailerShaktiAcquisitionAdmin').subscribe(
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

    this.SetCurrentMonth_Year();
    this.GetRole();
    this.PopulateLead();
  }

  SetCurrentMonth_Year(){
    var dt=new Date();
    this.Month = dt.getMonth() + 1;
    this.Year = dt.getFullYear();
  }

  PopulateLead() {

    this.StartDate = this.datePipe.transform(this.Fday,'yyyy-MM-dd');
    this.EndDate = this.datePipe.transform(new Date(),'yyyy-MM-dd');

    this.leadMgmtService.LeadMaster_List(this.Month, this.Year, this.IsMapped, this.VisitStatus, this.ShortRemark, this.StartDate, this.EndDate, (this.IsReachableBySales == false ? 'N' : 'Y'), this.Keyword).subscribe(
      (res) => {
        // console.log(res);
        for(var l=0; l<res.length; l++){
          res[l].UploadDate = moment(res[l].UploadDate).format("DD MMM, YYYY");
          res[l].isSelected = false;
        }
        this.LeadMasterList = res;
      }, (err: any) => {
        CommonFunc.handleError(err);
      }
    );
  }

  GetRole() {
    // console.log(ZoneID);
    this.authenticateService.GetRole('RetailerShaktiAcquisitionAdmin').subscribe(
      (res) => {
          // console.log('RoleExists: '+res[0].RoleExists);
         this.RoleExists = (res[0].RoleExists == 1 ? true : false);
         // console.log('IsMyCall: '+this.IsMyCall);
      }, (err: any) => {
          CommonFunc.handleError(err);
      });
  }

  onPageChange(pagenumber) {
    // console.log(val);
    this.page = pagenumber;
  }

  ShowTelecallerPopup() {
    this.TelecallerPopup = 'block';
    this.PopulateTelecaller();
  }

  HideTelecallerPopup() {
    this.TelecallerPopup = 'none';
  }

  PopulateTelecaller() {
    this.leadMgmtService.Telecaller_List(this.TelecallerSearch).subscribe(
      (res) => {
        console.log(res);
        this.TelecallerList = res;
      }, (err: any) => {
        CommonFunc.handleError(err);
      }
    );
  }

  SelectedTelecaller(RMID, RMName) {
    // console.log(RMID, RMName);
    this.RMID = RMID;
    this.RMName = RMName;
    this.HideTelecallerPopup();
    this.masterSelected = false;
    this.checkUncheckAll();
  }

  // The master checkbox will check/ uncheck all items
  checkUncheckAll() {
    var recCount = this.LeadMasterList.length;
    if (recCount > 50) { recCount = 50; }
    for (var i = 0; i < recCount; i++) {
      this.LeadMasterList[i].isSelected = this.masterSelected;
    }
    this.getCheckedItemList();
  }

  // Check All Checkbox Checked
  isAllSelected() {
    this.masterSelected = this.LeadMasterList.every(function(item:any) {
        return item.isSelected == true;
      })
    this.getCheckedItemList();
  }

  // Get List of Checked Items
  getCheckedItemList(){
    if(this.RMID == '') {
      this.PopulateLead();
      alert('Please select a telecaller first'); }
      else {
        this.LeadMasterCheckedList = [];
        for (var i = 0; i < this.LeadMasterList.length; i++) {
          if(this.LeadMasterList[i].isSelected)
            //this.LeadMasterCheckedList.push(this.LeadMasterList[i]);
          this.LeadMasterCheckedList.push({'LeadID': this.LeadMasterList[i].LeadID, 'MemberID': this.RMID });
        }
        //console.log(this.LeadMasterCheckedList);
      }
  }

  MapCaller() {
    // console.log(this.LeadMasterCheckedList);
    // console.log(this.RMID);
    //alert (this.RMID +', '+this.LeadMasterCheckedList.length+', '+this.LeadMasterCheckedList[0].MemberID);

    if(this.RMID == '') { 
      alert('Please select telecaller'); 
    }
    else if(this.LeadMasterCheckedList.length == 0)
      { alert('Please select at least one retailer lead to continue'); }
    else if(this.LeadMasterCheckedList.length > 0 && this.LeadMasterCheckedList[0].MemberID > 0) {
      if (confirm('Do you wish to allocate selected telecaller to the selected retailer leads?')) {
        this.leadMgmtService.MapTelecallerByLead(this.LeadMasterCheckedList).subscribe(
          (res) => {
            // console.log(res);
            alert('Telecaller allocated successfully.');
            this.PopulateLead();
          }, (err: any) => {
            CommonFunc.handleError(err);
          }
          );
      }
    }

  }

  ReachableBySalesOnChange(e) {
    // console.log(e.target.checked);
    if(!e.target.checked) {
      this.VisitStatus = 0;
      this.ShortRemark = '';
      this.StartDate = this.datePipe.transform(this.Fday,'yyyy-MM-dd');
      this.EndDate = this.datePipe.transform(new Date(),'yyyy-MM-dd');
    }
  }

  VisitStatusOnChange(e) {
    // console.log(e.target.value);
    if(e.target.value == 0 || e.target.value == 1) {
      this.ShortRemark = '';
      this.StartDate = this.datePipe.transform(this.Fday,'yyyy-MM-dd');
      this.EndDate = this.datePipe.transform(new Date(),'yyyy-MM-dd');
    }
  }

  SearchData() {
    this.PopulateLead();
  }
 
}
