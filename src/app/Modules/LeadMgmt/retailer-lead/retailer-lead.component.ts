import { Component, OnInit } from '@angular/core';
import { LeadMgmtService } from '../lead-mgmt.service';
import { CommonFunc } from '../../../Shared/commonFunc';
import * as moment from 'moment';
import { Constants } from '../../../Shared/constants';
import { AuthenticateService } from '../../Authentication/authenticate.service';
import { AuthorizeService } from '../../../Shared/authorize.service';

@Component({
  selector: 'app-social-media-lead',
  templateUrl: './retailer-lead.component.html',
  styleUrls: ['./retailer-lead.component.css']
})
export class RetailerLeadComponent implements OnInit {

  StateID:any = '';
  StateName = '';
  DistrictID:any = '';
  DistrictName = '';
  SourceMedia:any = '';
  MediaDetails:any;
  StateList:any = [];
  DistrictList:any = [];
  FilePath = '';
  FileName = '';
  WaitAlert = false;
  showbtnImport = true;
  LeadList:any = [];
  AllowRemove = 0;
  ValidateFieldStatus = 0;
  
  constructor(private leadMgmtService: LeadMgmtService,
    private authenticateService: AuthenticateService,
    private authorizeService: AuthorizeService) { }

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

  	this.PopulateState();
  	this.PopulateLead();
    this.GetAllowRemovalStatus();
  }

  PopulateState() {
    this.leadMgmtService.GetState().subscribe(
      (res) => {
        // console.log(res);
        if(res.length == 1) { 
        	this.StateID = res[0].StateID; 
        	this.StateName = res[0].StateName;
        	this.PopulateDistrict(res[0].StateID);
        	 }        
        this.StateList = res;
      }, (err: any) => {
        CommonFunc.handleError(err);
      }
    );
  }

  StateOnChange() {
  	console.log(this.StateID);
  	this.PopulateDistrict(this.StateID);
  }

  PopulateDistrict(StateID) {  	
    this.authenticateService.GetDistrictByState(StateID).subscribe(
      (res) => {
        console.log(res);   
        this.DistrictList = res;
      }, (err: any) => {
        CommonFunc.handleError(err);
      }
    );
  }

  GetDistrict() {
  	// console.log(this.DistrictID);
  	// console.log(this.DistrictList);
  	for(var i = 0; i < this.DistrictList.length; i++) {
  		if(this.DistrictList[i].DistrictID == this.DistrictID) {
        this.DistrictName = this.DistrictList[i].District;  
        // console.log(this.DistrictName);
      }  		
  	}
  }

  DistrictOnChange(DistrictID) {
  	console.log(DistrictID);
  	console.log(this.DistrictList);
  	for(var i = 0; i < this.DistrictList.length; i++) {
  		this.DistrictID = this.DistrictList[0].DistrictID;
  		this.DistrictName = this.DistrictList[0].District;
  	}

  }

  UploadPicture(event) {
  	// this.LoadingText = 'Uploading...Please wait! Do not close or change page.';
  	if (event.target.files[0]) {
      const filename = event.target.files[0].name;
      let last_dot = filename.lastIndexOf('.');
      let ext = filename.slice(last_dot + 1);

      if(ext != 'exe' && ext != 'bat' || ext == 'xls' || ext == 'xlsx') {

        this.leadMgmtService.uploadFile(event.target.files[0]).subscribe(
          (res) => {
            // console.log(res);
            if(res.statusText == 'OK' && res.body != undefined) { 
              // console.log(res.body.split('|')); 
              var File = res.body.split('|');
              // console.log(File);
              this.FileName = File[0];
              this.FilePath = File[1];
            }  				
            // this.LoadingText = 'Picture Uploaded!';
          }, (err: any) => {
            CommonFunc.handleError(err);
          })
      }
      else { alert('Invalid file type. Allowed types are: xls; xlsx'); }  	
    } 
  }

  validateFields() {
    // console.log(this.StateID, this.SourceMedia, this.FileName);
    if (this.StateID == '') {
      this.ValidateFieldStatus = 0;
      return false;
    }
    if (this.StateID != '' && this.DistrictID == '') {
      this.ValidateFieldStatus = 0;
      return false;
    }
    if (this.SourceMedia == '') {
      this.ValidateFieldStatus = 0;
      return false;
    }
    if (this.FileName == '') {
      this.ValidateFieldStatus = 0;
      alert('Please choose file to proceed');
      return false;
    } 
    this.ValidateFieldStatus = 1;       
    return true;
  }

  ImportLead() {
  	// console.log(this.FileName, this.FilePath);    
    //if(this.validateFields()) {console.log(this.ValidateFieldStatus);}
    //else {console.log(this.ValidateFieldStatus);}

    if(this.validateFields()) {
      this.GetDistrict();
      this.WaitAlert = true;
      this.showbtnImport = false;
      this.leadMgmtService.LeadImport_Insert(this.StateID, this.StateName, this.DistrictID, this.DistrictName, this.SourceMedia, (this.MediaDetails == undefined ? '':this.MediaDetails), this.FileName, this.FilePath).subscribe(res => {
        console.log(res);
        this.WaitAlert = false;
        this.showbtnImport = true;
        setTimeout(() => { this.PopulateLead(); }, 1500)
      })
    }
  }  

  PopulateLead() {
    this.leadMgmtService.LeadImport_List().subscribe(
      (res) => {
        // console.log(res);
        for(var r=0; r<res.length; r++) { 
        	res[r].UploadDate = moment(res[r].UploadDate).format('DD MMM, YYYY'); 
        	res[r].FilePath = Constants.apiURL+res[r].FilePath;
        }
        this.LeadList = res;
      }, (err: any) => {
        CommonFunc.handleError(err);
      }
    );
  }

  GetAllowRemovalStatus() {
    this.authenticateService.GetAllowRemovalStatus().subscribe(
      (res) => {
        // console.log(res);
        this.AllowRemove = res;
      }, (err: any) => {
        CommonFunc.handleError(err);
      }
    );
  }

  DeleteLead(id) {
  	// console.log(id);
  	if(confirm('Are you sure that you want to delete this particular record?')){
  		this.leadMgmtService.LeadImport_Delete(id).subscribe(res => {
  			// console.log(res);
  			this.PopulateLead();
  		})
  	}
  }

}
