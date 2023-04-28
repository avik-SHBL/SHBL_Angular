import { Component, OnInit } from '@angular/core';
import { LeadMgmtService } from '../../LeadMgmt/lead-mgmt.service';
import { CommonFunc } from '../../../Shared/commonFunc';
import * as moment from 'moment';
import { Constants } from '../../../Shared/constants';
import { AuthenticateService } from '../../Authentication/authenticate.service';
import { AuthorizeService } from '../../../Shared/authorize.service';

@Component({
  selector: 'app-telecalling-status-report',
  templateUrl: './telecalling-status-report.component.html',
  styleUrls: ['./telecalling-status-report.component.css']
})
export class TelecallingStatusReportComponent implements OnInit {

	Month:any;
  	Year:any;
	TelecallerPopup: string = 'none';
	TelecallerSearch = '';
	TelecallerList:any = [];
	RMID:any=0;
	RMName:string = '';
	CallingStatus = 1;
	SourceMedia = '';
	MediaDetails = '';
	url = '';

  constructor(private leadMgmtService: LeadMgmtService,
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
  	this.GenerateReport();

  }

  SetCurrentMonth_Year(){
    var dt=new Date();
    this.Month = dt.getMonth() + 1;
    this.Year = dt.getFullYear();
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
        // console.log(res);
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
  }

  GenerateReport() {
  	//console.log('Month='+this.Month+'&Year='+this.Year+'&CallingStatus='+this.CallingStatus+'&EmpID='+this.RMID+'&SourceMedia='+this.SourceMedia+'&MediaDetails='+this.MediaDetails+'&SessionToken='+localStorage.getItem('token'));
  	this.url = Constants.apiURL + '/Report/TeleCallingStatusReport?Month='+this.Month+'&Year='+this.Year+'&CallingStatus='+this.CallingStatus+'&EmpID='+this.RMID+'&SourceMedia='+this.SourceMedia+'&MediaDetails='+this.MediaDetails+'&SessionToken='+localStorage.getItem('token');
  	// console.log(this.url);
  }

}
