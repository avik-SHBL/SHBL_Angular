import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { LeadMgmtService } from '../lead-mgmt.service';
import { CommonFunc } from '../../../Shared/commonFunc';
import { ParseJsonDatePipe } from '../../../Shared/Pipes/parse-json-date.pipe';
import { AuthorizeService } from '../../../Shared/authorize.service';
import { Constants } from '../../../Shared/constants';

@Component({
  selector: 'app-communication-setting-list',
  templateUrl: './communication-setting-list.component.html',
  styleUrls: ['./communication-setting-list.component.css'],
  providers: [ParseJsonDatePipe]

})
export class CommunicationSettingListComponent implements OnInit {

	StartDate:any = '';
	EndDate:any = '';
	IsReachable:string = 'All';
	Keyword:string = '';
	dt = new Date();
  	Fday = new Date(this.dt.getFullYear(), this.dt.getMonth(), 1);
  	CommunicationSettingsListArr:any = {};
  	CommunicationSettingsList:any = [];

	  apiUrl:string = '';

	constructor(private datePipe: DatePipe,
		private leadMgmtService: LeadMgmtService,
		private authorizeService: AuthorizeService,
		private parseJsonDatePipe: ParseJsonDatePipe) { }

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

		this.StartDate = this.datePipe.transform(this.Fday,'yyyy-MM-dd');
    	this.EndDate = this.datePipe.transform(new Date(),'yyyy-MM-dd');
    	
    	this.PopulateGrid();
		this.apiUrl= Constants.apiURL;
	}

	Fill_CommunicationSettingsListArr() {

		this.CommunicationSettingsListArr = {
			'StartDate': this.StartDate
			,'EndDate': this.EndDate
			,'Keyword': this.Keyword
			,'IsReachable': this.IsReachable
		}

	}

	PopulateGrid() {
		this.Fill_CommunicationSettingsListArr();
		// console.table(this.CommunicationSettingsListArr);
		this.leadMgmtService.CommunicationSettings_List(this.CommunicationSettingsListArr).subscribe(
      (res) => {
        // console.log(res);
        for(var l=0; l<res.length; l++) {
          res[l].UploadStartDate = this.parseJsonDatePipe.transform(res[l].UploadStartDate);
          res[l].UploadEndDate = this.parseJsonDatePipe.transform(res[l].UploadEndDate);
		  res[l].PublishDate = this.parseJsonDatePipe.transform(res[l].PublishDate);

        }
        this.CommunicationSettingsList = res;
      }, (err: any) => {
        CommonFunc.handleError(err);
      }
    );

	}

}
