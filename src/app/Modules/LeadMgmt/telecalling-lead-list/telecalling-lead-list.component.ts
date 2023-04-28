import { Component, OnInit } from '@angular/core';
import { LeadMgmtService } from '../lead-mgmt.service';
import { CommonFunc } from '../../../Shared/commonFunc';
import * as moment from 'moment';
import { Constants } from '../../../Shared/constants';
import { AuthenticateService } from '../../Authentication/authenticate.service';
import { AuthorizeService } from '../../../Shared/authorize.service';

@Component({
  selector: 'app-telecalling-lead-list',
  templateUrl: './telecalling-lead-list.component.html',
  styleUrls: ['./telecalling-lead-list.component.css']
})
export class TelecallingLeadListComponent implements OnInit {

  Month:any;
  Year:any;
  IsMyCall:any = 0;
  Keyword:string = '';
  FreshCalls_List:any = [];
  TelecallingStatus:any = {};
  ValidateFieldStatus:any;
  CallingStatusPopup = 'none';
  EmployeeList:any = [];
  RetailerLead:any = {};
  page = '';
  VRemark: any;

  constructor(private leadMgmtService: LeadMgmtService,
    private authenticateService: AuthenticateService,
    private authorizeService: AuthorizeService) { }

  ngOnInit(): void {

    this.authorizeService.AuthorizeUserByRole('RetailerShaktiAcquisitionAdmin').subscribe(
      (res) => {
        // console.log(res);
        if(!res){
          this.authorizeService.AuthorizeUserByRole('RetailerShaktiAcquisitionStaff').subscribe(
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
    
  	this.SetCurrentMonth_Year();    
  	this.TelecallingStatus.CallingStatus = '';
  	this.TelecallingStatus.RejectionReason = '';
  	this.TelecallingStatus.FollowUpDate = ''; 
  	this.TelecallingStatus.MappedEmpID = '';
  	////this.RetailerLead.ReachableBySalesTeam = false;
  	this.GetRole(); 
  }

  SetCurrentMonth_Year(){
    var dt=new Date();
    this.Month = dt.getMonth() + 1;
    this.Year = dt.getFullYear();
  }

  GetRole() {
    // console.log(ZoneID);
    this.authenticateService.GetRole('RetailerShaktiAcquisitionAdmin').subscribe(
      (res) => {
          // console.log('RoleExists: '+res[0].RoleExists);
         this.IsMyCall = (res[0].RoleExists == 1 ? 0 : 1);
         // console.log('IsMyCall: '+this.IsMyCall);
         this.PopulateFreshCallsList();
      }, (err: any) => {
          CommonFunc.handleError(err);
      });
  }

  onPageChange(pagenumber) {
    // console.log(val);
    this.page = pagenumber;
  }

  PopulateFreshCallsList() {
    //this.GetRole(); 
    // console.log(this.IsMyCall);
    this.leadMgmtService.FreshCalls_List(this.Month, this.Year, this.IsMyCall, this.Keyword).subscribe(
      (res) => {
        console.log(res);
        for(var l=0; l<res.length; l++){
          res[l].UploadDate = moment(res[l].UploadDate).format("DD MMM, YYYY");
        }
        this.FreshCalls_List = res;
      }, (err: any) => {
        CommonFunc.handleError(err);
      }
    );
  }

  PopulateEmployees() {
    this.leadMgmtService.GetEmployee_List().subscribe(
      (res) => {
        console.log(res);
        this.EmployeeList = res;
        if(res.length == 1) {this.TelecallingStatus.MappedEmpID = res[0].RMID;}
        
      }, (err: any) => {
        CommonFunc.handleError(err);
      }
    );
  }

  ShowUpdateTelecallingStatusPopup(LeadID, LeadName, Location, VisitShortRemark) {

    this.TelecallingStatus.CallingStatus = '';
    this.TelecallingStatus.MappedEmpID = '';
    this.TelecallingStatus.FollowUpDate = '';
    this.TelecallingStatus.Remarks = '';
    this.CallingStatusPopup = 'block';
    this.PopulateEmployees();
    this.TelecallingStatus.LeadID = LeadID;
    this.TelecallingStatus.LeadName = LeadName;
    this.TelecallingStatus.Location = Location;
    this.VRemark = VisitShortRemark;
    this.PopulateRetailerLead();
  }

  CloseUpdateTelecallingStatusPopup() { this.CallingStatusPopup = 'none'; this.PopulateFreshCallsList();}

  ValidateTelecallingStatusFields() {
    // console.log(this.TelecallingStatus);
    if (this.TelecallingStatus.CallingStatus == '') {
      this.ValidateFieldStatus = 0;
      return false;
    }
    if (this.TelecallingStatus.CallingStatus == 2 && this.TelecallingStatus.FollowUpDate == '') {
      this.ValidateFieldStatus = 0;
      return false;
    }
    if (this.TelecallingStatus.CallingStatus == 5 && this.TelecallingStatus.RejectionReason == '') {
      this.ValidateFieldStatus = 0;
      return false;
    } 
    this.ValidateFieldStatus = 1;       
    return true;
  }

  SaveCalls() {  	
  	if(this.ValidateTelecallingStatusFields()) {
      if (this.TelecallingStatus.CallingStatus == 1) {
        if (this.VRemark != 'Activation Done') {
          if (this.VRemark != 'ON BOARD') {
            if (this.VRemark != 'Already ON BOARD') {
              // console.log("conditon check");
              let Activity = 'Interested';
              this.leadMgmtService.LeadStatusChangeEmail(this.TelecallingStatus.LeadID, Activity, this.TelecallingStatus.Remarks).subscribe(res => {
                if (res) {
                  console.log(res);
                  alert(`email send : ${this.TelecallingStatus.LeadName} is Interested.`);
                }
              })
            }
          }
        }
      };
  		this.leadMgmtService.TelecallingStatus_Insert(this.TelecallingStatus).subscribe(
  			(res) => {
  				// console.log(res);  
  				//this.CloseUpdateTelecallingStatusPopup();
  				alert('Telecalling status saved successfully.');
          this.TelecallingStatus.CallingStatus = '';
          this.TelecallingStatus.MappedEmpID = '';
          this.TelecallingStatus.FollowUpDate = '';
          this.TelecallingStatus.Remarks = '';
  				//this.PopulateFreshCallsList();	
          this.CloseUpdateTelecallingStatusPopup();			
  			}
  			)
  	}
  }

  PopulateRetailerLead() {
    this.leadMgmtService.RetailerLead_SelectOne(this.TelecallingStatus.LeadID).subscribe(
      (res) => {
        console.log(res);
        ////this.RetailerLead.ReachableBySalesTeam == 'N' ? false : true;
        this.RetailerLead = res[0];
      }, (err: any) => {
        CommonFunc.handleError(err);
      }
    );
  }

  ValidateRetailerLeadFields() { 
  	// console.log(this.RetailerLead);
    this.ValidateFieldStatus = 1;       
    return true;
  }

  UpdateRetailerLead() {  	
  	console.log(this.ValidateRetailerLeadFields());
  	if(this.ValidateRetailerLeadFields()){
  		this.leadMgmtService.RetailerLead_Update(this.RetailerLead).subscribe(
  			(res) => {
  				// console.log(res);  
  				//this.CloseUpdateTelecallingStatusPopup();
  				alert('Lead updated successfully.');
  				//this.PopulateFreshCallsList();				
  			}
  			)
  	}
  }

}
