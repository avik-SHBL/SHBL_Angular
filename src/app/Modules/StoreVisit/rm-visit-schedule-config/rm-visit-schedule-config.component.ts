import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AuthorizeService } from '../../../Shared/authorize.service';
import { RMVisitScheduleConfig } from '../rm-visit-schedule-config/rm-visit-schedule-config';
import { StoreVisitService } from '../store-visit.service';
import { Constants } from '../../../Shared/constants';
import { CommonFunc } from '../../../Shared/commonFunc';

@Component({
  selector: 'app-rm-visit-schedule-config',
  templateUrl: './rm-visit-schedule-config.component.html',
  styleUrls: ['./rm-visit-schedule-config.component.css']
})
export class RmVisitScheduleConfigComponent implements OnInit {

	RMVisitScheduleConfig : any = {};
	RMVisitScheduleConfigList : any = [];
	ScheduledVisitDate : any;
	ROID : number = 0;
	ROName : string = '';

  CurDate: any;

  constructor(private authorizeService: AuthorizeService,
  	private activatedRoute:ActivatedRoute,
    private datePipe: DatePipe,
  	private storeVisitService: StoreVisitService) { }

  ngOnInit(): void {
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

    this.CurDate = this.datePipe.transform(new Date(),'dd/MM/yyyy');
    
    // console.log(this.datePipe.transform(this.activatedRoute.snapshot.params.ScheduleDate,'dd-MM-yyyy'));
  	this.RMVisitScheduleConfig.ScheduledVisitDate = this.activatedRoute.snapshot.params.ScheduleDate != null ? this.activatedRoute.snapshot.params.ScheduleDate : '';
    this.RMVisitScheduleConfig.ScheduledVisitDateFormatted = this.activatedRoute.snapshot.params.ScheduleDate != null ? this.datePipe.transform(this.activatedRoute.snapshot.params.ScheduleDate,'dd-MM-yyyy') : '';
    this.RMVisitScheduleConfig.ROID = this.activatedRoute.snapshot.params.ROID != null ? this.activatedRoute.snapshot.params.ROID : '';
    this.RMVisitScheduleConfig.ROName = this.activatedRoute.snapshot.params.ROName != null ? this.activatedRoute.snapshot.params.ROName : '';
    this.PopulateRMVisitScheduleConfigGrid();
  }

  PopulateRMVisitScheduleConfigGrid(){
  	this.storeVisitService.GetRMScheduleConfigList(this.RMVisitScheduleConfig.ROID, this.RMVisitScheduleConfig.ScheduledVisitDate).subscribe((res:any) => {
  			// console.log(res);
  			if(res != null){
  				this.RMVisitScheduleConfigList = res;
  			}
  		}, (err: any) => {
        CommonFunc.handleError(err);
      });
  }

  ValidateFields(){
  	if(this.RMVisitScheduleConfig.Location == null){
  		alert('Please enter location');
  		return false;
  	}
  	return true;
  }

  AddRMVisitScheduleConfigForm(RMVisitScheduleConfig : any){  	
  	if(this.ValidateFields()){
  		// console.log(this.RMVisitScheduleConfig);
  		this.storeVisitService.AddRMScheduleConfig(this.RMVisitScheduleConfig).subscribe((res:any) => {
  			// console.log(res);
  			alert('Visit schedule added successfully');
  			this.RMVisitScheduleConfig.Location = '';
  			this.RMVisitScheduleConfig.StoreName = '';
  			this.RMVisitScheduleConfig.ContactPerson = '';
  			this.RMVisitScheduleConfig.ContactNo = '';
  			this.RMVisitScheduleConfig.Description = '';
  			this.PopulateRMVisitScheduleConfigGrid();
  		}, (err: any) => {
        CommonFunc.handleError(err);
      });
  	}
  }

  Delete(ScheduleID){
  	if(confirm('Are you sure that you want to delete this record?')){
  		this.storeVisitService.DeleteRMScheduleConfig(this.RMVisitScheduleConfig.ROID, ScheduleID).subscribe((res:any) => {
  			// console.log(res);
  			alert('Visit schedule deleted successfully');
  			this.PopulateRMVisitScheduleConfigGrid();
  		}, (err: any) => {
        CommonFunc.handleError(err);
      });
  	}
  }

}
