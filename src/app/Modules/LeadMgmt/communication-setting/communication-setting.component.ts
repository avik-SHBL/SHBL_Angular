import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { CommonFunc } from '../../../Shared/commonFunc';
import { LeadMgmtService } from '../lead-mgmt.service';
import { AuthenticateService } from '../../Authentication/authenticate.service';
import { ActivatedRoute } from '@angular/router';
import { InputJsonDatePipe } from '../../../Shared/Pipes/input-json-date.pipe';
import { AuthorizeService } from '../../../Shared/authorize.service';
import { Constants } from '../../../Shared/constants';
import { CompressImageService } from '../../../Shared/compress-image.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-communication-setting',
  templateUrl: './communication-setting.component.html',
  styleUrls: ['./communication-setting.component.css']
})
export class CommunicationSettingComponent implements OnInit {

	  CommunicationSettingForm:FormGroup;
	  submitted:boolean = false;
  	StateList:any = [];
  	DistrictList:any = [];
  	ValidateFieldStatus:number = 0;
    BannerUrl:string = '';
    BannerFilePath:string = '';
    DispBannerModal:string = 'none';
    BannersList:any = [];
    Url:string = Constants.apiURL;
	MobileNo:any = '';
    SMSMessage:string = '';
    SMSsubmitted:boolean = false;
    EmailAddress:any = '';
    EmailMessage:string = '';
    Emailsubmitted:boolean = false;    
    ShowEmailValidation:boolean = false;

	constructor(private fb: FormBuilder,
		private datePipe: DatePipe,
		private leadMgmtService: LeadMgmtService,
		private authenticateService: AuthenticateService,
		private activatedRoute: ActivatedRoute,
		private authorizeService: AuthorizeService,
		private inputJsonDatePipe: InputJsonDatePipe,
    private compressImage: CompressImageService) { }

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

		this.CommunicationSettingForm = this.fb.group({
			MessageText: ['', Validators.required],      
			StateID: [0],
			DistrictID: [0],
			IsEmail: [false],
			IsSMS: [false],
			IsWhatsApp: [false],
      BannerFilePath: [''],
			IsReachable: ['No'],
			CallingState: [0],
			IsVisited: [0],
			VisitShortRemark: [''],
			IsFirstTime: [1],
			IsBasedOnUpload: [false],
			UploadStartDate: [''],
			UploadEndDate: [''],
			CallingStatus: [''],
			PublishDate: [this.datePipe.transform(new Date(),'yyyy-MM-dd'), Validators.required],
			SessionToken: localStorage.getItem('token')
		});		

		this.PopulateState();

		if(this.activatedRoute.snapshot.params.SettingID != undefined ) {
			this.CommunicationSettingForm.value.SettingID = this.activatedRoute.snapshot.params.SettingID;
			this.PopulateFields(this.activatedRoute.snapshot.params.SettingID);
		}
		this.PopulateCookies();
	}

	get f() { return this.CommunicationSettingForm.controls; }

	PopulateState() {
    this.leadMgmtService.GetAllState().subscribe(
      (res) => {
        // console.log(res);        	         
        this.StateList = res;
      }, (err: any) => {
        CommonFunc.handleError(err);
      }
    );
  }

  StateOnChange() {
  	// console.log(this.CommunicationSettingForm.value.StateID);
  	if(this.CommunicationSettingForm.value.StateID == 0) {
  		this.CommunicationSettingForm.patchValue({DistrictID: [0]});
  	}
  	else {
  		this.PopulateDistrict(this.CommunicationSettingForm.value.StateID);
  	}  	
  }

  PopulateDistrict(StateID) {  	
  	this.authenticateService.GetDistrictByState(StateID).subscribe(
  		(res) => {
  			// console.log(res);   
  			this.DistrictList = res;
  		}, (err: any) => {
  			CommonFunc.handleError(err);
  		}
  		);
  }

  PopulateFields(SettingID) {  	
  	this.leadMgmtService.CommunicationSettings_SelectOne(SettingID).subscribe(
  		(res) => {
  			console.log(res);
  			if(res.length == 1) { 
  				this.CommunicationSettingForm = this.fb.group({
  					SettingID: SettingID,
  					MessageText: res[0].MessageText,            
  					StateID: res[0].StateID,
  					DistrictID: res[0].DistrictID,
  					IsEmail: res[0].IsEmail == 1 ? true : false,
  					IsSMS: res[0].IsSMS == 1 ? true : false,
  					IsWhatsApp: res[0].IsWhatsApp == 1 ? true : false,
            BannerFilePath: res[0].BannerFilePath != null ? res[0].BannerFilePath : '',
  					IsReachable: res[0].IsReachable,
  					CallingState: res[0].CallingState,
  					IsVisited: res[0].IsVisited != 0 ? res[0].IsVisited : 0,
  					VisitShortRemark: res[0].VisitShortRemark != null ? res[0].VisitShortRemark : '',
  					IsFirstTime: res[0].IsFirstTime,
  					IsBasedOnUpload: res[0].IsBasedOnUpload,
  					UploadStartDate: res[0].UploadStartDate != null ? this.inputJsonDatePipe.transform(res[0].UploadStartDate) : '',
  					UploadEndDate: res[0].UploadEndDate != null ? this.inputJsonDatePipe.transform(res[0].UploadEndDate) : '',
  					CallingStatus: res[0].CallingStatus != 0 ? res[0].CallingStatus : '',
  					PublishDate: res[0].PublishDate != null ? this.inputJsonDatePipe.transform(res[0].PublishDate) : '',
  					SessionToken: localStorage.getItem('token')
  				});	
  				this.PopulateDistrict(this.CommunicationSettingForm.value.StateID);          
          this.PopulateBannerImg(this.CommunicationSettingForm.value.BannerFilePath);
  			}
  		}, (err: any) => {
  			CommonFunc.handleError(err);
  		}
  		);
  }

  CallingState_OnChange(e) {
  	// console.log(e.target.value);
  	if(e.target.value == 0) {
  		this.CommunicationSettingForm.patchValue({
			CallingStatus: ['']
		});	
  	}
  }

  IsReachable_OnChange(e) {
  	// console.log(e.target.value);
  	if(e.target.value == 'No') {
  		this.CommunicationSettingForm.patchValue({
			IsVisited: [2],
			VisitShortRemark: ['']
		});	
  	}
  }

  IsVisited_OnChange(e) {
  	// console.log(e.target.value);
  	if(e.target.value == 0 || e.target.value == 2) {
  		this.CommunicationSettingForm.patchValue({
			VisitShortRemark: ['']
		});	
  	}
  }

  IsBasedOnUpload_OnChange(e) {
  	// console.log(e.target.checked);
  	if(!e.target.checked) {
  		this.CommunicationSettingForm.patchValue({
			UploadStartDate: [''],
			UploadEndDate: [''],
		});	
  	}
  }

  ValidateFields() {

  	// if (this.CommunicationSettingForm.value.CallingState == 1 && this.CommunicationSettingForm.value.CallingStatus == '') {
  	// 	this.ValidateFieldStatus = 0;
  	// 	return false;
  	// }

  	// if (this.CommunicationSettingForm.value.IsReachable == 'Yes' && this.CommunicationSettingForm.value.IsVisited == 1 
  	// 	&& this.CommunicationSettingForm.value.VisitShortRemark == '') {
  	// 	this.ValidateFieldStatus = 0;
  	// 	return false;
  	// }

  	if (this.CommunicationSettingForm.value.IsBasedOnUpload == true && (this.CommunicationSettingForm.value.UploadStartDate == '' 
  	|| this.CommunicationSettingForm.value.UploadEndDate == '')) {
	  	this.ValidateFieldStatus = 0;
	  	return false;
	} 

	this.ValidateFieldStatus = 1;       
	return true;
	}

	Save() {

		this.submitted = true;

		if (this.CommunicationSettingForm.invalid) {
			return;
		}

		if(this.ValidateFields()) {
			// console.table(this.CommunicationSettingForm.value);
			if(this.activatedRoute.snapshot.params.SettingID != undefined ) {  				
				this.leadMgmtService.CommunicationSettings_Update(this.CommunicationSettingForm.value).subscribe(res => {
					// console.log(res);
				})
			}
			else {
				this.leadMgmtService.CommunicationSettings_Insert(this.CommunicationSettingForm.value).subscribe(res => {
					// console.log(res);
				})
			}
			location.href = 'Home/CommunicationSettingsList';
		}      

    // console.log(this.CommunicationSettingForm.value);    

		}

    UploadBanner(e) {
      // console.log(e.target.files);
      if(e.target.files != undefined && e.target.files.length > 0) {
        if(e.target.files[0].type == 'image/jpeg' || e.target.files[0].type == 'image/png') {
          this.leadMgmtService.uploadBanner(e.target.files[0]).subscribe(res => {
            // console.log(res.body);
            if(res.body != undefined || res.body != null) {
              this.PopulateBannerImg(res.body);
            }
          })
        }
      }
    }

    PopulateBannerImg(img) {
      // console.log(img);
      if(img != '') {
        this.BannerUrl = Constants.apiURL+img;    
        this.CommunicationSettingForm.value.BannerFilePath = img; 
      }
    }

    ShowExisitingBanner() {
      this.DispBannerModal = 'block';
      this.PopulateAllBanners();
    }

    HideExisitngBanner() {
      this.DispBannerModal = 'none';
    }

    PopulateAllBanners() {
    this.leadMgmtService.GetAllBanners().subscribe(
      (res) => {
        // console.log(res); 
        for(var i = 0; i < res.length; i++) {
          res[i].BannerFilePath = res[i].BannerFilePath;
        }                  
        this.BannersList = res;
      }, (err: any) => {
        CommonFunc.handleError(err);
      }
    );
  }

  GetSelectedBanner(file) {
    // console.log(file);
    this.BannerUrl = Constants.apiURL+file;    
    this.CommunicationSettingForm.value.BannerFilePath = file; 
    this.HideExisitngBanner();
  }

  EmailOnChange(e) {
    // console.log(e.target.checked);
    if(e.target.checked == false) {
      this.BannerUrl = '';    
      this.CommunicationSettingForm.value.BannerFilePath = ''; 
    }
  }

  SendSMS() {
	// console.log(this.MobileNo, this.CommunicationSettingForm.value.MessageText);
	this.SMSsubmitted = true;

	if(this.CommunicationSettingForm.value.MessageText == '') {
		alert('Please enter message to send test SMS');
		location.reload();
	}
	else {

		let formattedSMSMessage = this.CommunicationSettingForm.value.MessageText.replace(/\n/g,'Environment.NewLine');

		if(this.MobileNo != '' && formattedSMSMessage != '') {  		
			this.leadMgmtService.SendSMS(this.MobileNo, formattedSMSMessage).subscribe(res => {
				// console.log(res);
				if(res == 1) {
					localStorage.setItem('MobileNo', this.MobileNo);
					alert('Test SMS sent successfully.');	
				}
				location.reload();  			
			})
		}
	}
}

ValidateEmail() {
	let emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
	if(this.EmailAddress != '' && (String(this.EmailAddress).search(emailPattern) != -1) == false) {
		this.ShowEmailValidation = true;  		
	}
	else {
		this.ShowEmailValidation = false;
	}
}

SendEmail() {
	// console.log(this.EmailAddress, this.CommunicationSettingForm.value.MessageText);

	this.Emailsubmitted = true;

	if(this.CommunicationSettingForm.value.MessageText == '') {
		alert('Please enter message to send test email');
		location.reload();
	}
	else {
		let formattedEmailMessage = this.CommunicationSettingForm.value.MessageText.replace(/\n/g,'Environment.NewLine');

		if(this.EmailAddress != '' && this.CommunicationSettingForm.value.MessageText != '') { 
			this.leadMgmtService.SendEmail(this.EmailAddress, formattedEmailMessage, this.BannerUrl).subscribe(res => {
				// console.log(res);
				if(res == 1) {
					localStorage.setItem('EmailAddress', this.EmailAddress);
					alert('Test email sent successfully.');	
				}
				location.reload();  			
			})
		}
	}
}

PopulateCookies() {
	// console.log(localStorage.getItem('MobileNo'), localStorage.getItem('EmailAddress'));
	if(localStorage.getItem('MobileNo') != '' &&  localStorage.getItem('MobileNo'))
		this.MobileNo = localStorage.getItem('MobileNo');
	if(localStorage.getItem('EmailAddress') != '' && localStorage.getItem('EmailAddress'))
		this.EmailAddress = localStorage.getItem('EmailAddress');
}

}
