import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms'
import { StoreVisitService } from '../store-visit.service';
import { CommonFunc } from 'src/app/Shared/commonFunc';
import { Router } from '@angular/router';
import { AuthorizeService } from 'src/app/Shared/authorize.service';
import { Constants } from 'src/app/Shared/constants';


@Component({
  selector: 'app-new-rm-sales-target',
  templateUrl: './new-rm-sales-target.component.html',
  styleUrls: ['./new-rm-sales-target.component.css']
})
export class NewRmSalesTargetComponent implements OnInit {

  NewRmTarget: boolean = false;

  salesTargetForm: FormGroup;
  submitted = false;
  Keyword: string = '';
  RM_List: any = [];
  UserID: any;
  WithEffectFrom: any;
  workDaysNo: any;
  dailyVisitNo: any;
  DailyNewMinOrderNo: any;
  calculateMonthlyVisit: any;
  MonthlyNewOrderMinimum: any;
  sessionToken: any;
  updateId: any;
  isEditable: boolean = false;
  IsupdateData: boolean = false;

  constructor(private authorizeService: AuthorizeService, private fb: FormBuilder, private datePipe: DatePipe, private storeVisitService: StoreVisitService, private router: Router) { }

  ngOnInit(): void {
    this.authorizeService.AuthorizeUserByRole('RetailerShaktiStoreVisitAdmin').subscribe((res) => {
  			// console.log(res);
  			if(!res){
  				alert('Warning! You do not have authorization to access this page.');
  				this.authorizeService.LogoutUser().subscribe(
  					(res) => {
  						// console.log(res);
  					}, (err: any) => {
  						CommonFunc.handleError(err);
  					});
  				localStorage.removeItem('token');
  				location.href = Constants.siteURL;
  			}else {
          this.NewRmTarget = true;
          this.sessionToken = localStorage.getItem('token')
          this.createsalesTargetForm();
          this.storeVisitService.data.subscribe((res) => {
            if (res != 0) {
              this.updateId = res;
              this.editsalesTargetForm();
            }
          })
          this.GetRMList();
        }
  	});
  }

  createsalesTargetForm() {
    let today = new Date();
    let WEFday = new Date(today.getFullYear(), today.getMonth(), 1);
    this.WithEffectFrom = this.datePipe.transform(WEFday, 'yyyy-MM-dd');
    this.salesTargetForm = this.fb.group({
      IsDefault: [true, Validators.required],
      WithEffectFrom: [this.WithEffectFrom, Validators.required],
      MemberID: [0, Validators.required],
      VisitType: [1, Validators.required],
      DaysOfWork: ['', Validators.required],
      DailyVisit: ['', Validators.required],
      MonthlyVisit: ['', Validators.required],
      DailyNewOrderMinimum: ['', Validators.required],
      MonthlyNewOrderMinimum: ['', Validators.required],
      MonthlyOnBoard: ['', Validators.required],
      RetailerCount5Lakh: ['', Validators.required],
      ExpectedMonthlySale: ['', Validators.required],
      SessionToken: [this.sessionToken, Validators.required],
      SalesTargetID: ['']
    });
  }

  get f() { return this.salesTargetForm.controls; }

  editsalesTargetForm() {
    this.storeVisitService.GetNewRMSalesTargetBySalesTargetID(this.updateId).subscribe((resp) => {
      // console.log("to be update", resp);
      let d = resp[0];
      if (resp) {
        this.salesTargetForm.patchValue({ 'IsDefault': d.IsDefault });
        this.salesTargetForm.patchValue({ 'WithEffectFrom': d.WithEffectFrom });
        this.salesTargetForm.patchValue({ 'MemberID': d.MemberID });
        this.salesTargetForm.patchValue({ 'VisitType': d.VisitType });
        this.salesTargetForm.patchValue({ 'DaysOfWork': d.DaysOfWork });
        this.salesTargetForm.patchValue({ 'DailyVisit': d.DailyVisit });
        this.salesTargetForm.patchValue({ 'MonthlyVisit': d.MonthlyVisit });
        this.salesTargetForm.patchValue({ 'DailyNewOrderMinimum': d.DailyNewOrderMinimum });
        this.salesTargetForm.patchValue({ 'MonthlyNewOrderMinimum': d.MonthlyNewOrderMinimum });
        this.salesTargetForm.patchValue({ 'MonthlyOnBoard': d.MonthlyOnBoard });
        this.salesTargetForm.patchValue({ 'RetailerCount5Lakh': d.RetailerCount5Lakh });
        this.salesTargetForm.patchValue({ 'ExpectedMonthlySale': d.ExpectedMonthlySale });
        this.salesTargetForm.patchValue({ 'SalesTargetID': d.SalesTargetID });

        this.workDaysNo = d.DaysOfWork;
        this.dailyVisitNo = d.DailyVisit;
        this.calculateMonthlyVisit = d.MonthlyVisit;
        this.DailyNewMinOrderNo = d.DailyNewOrderMinimum;
        this.MonthlyNewOrderMinimum = d.MonthlyNewOrderMinimum;
        this.isEditable = true;
        this.IsupdateData = true;
      }
    })
  }

  GetRMList() {
    this.storeVisitService.GetRMList(this.Keyword).subscribe(
      (res) => {
        // console.log("RM List", res)
        this.RM_List = res;
        if (res.length == 1) {
          this.UserID = res[0].MemberID;
        }
      }, (err: any) => {
        CommonFunc.handleError(err);
      }
    );
  }

  changeDefault() {
    // console.log("change Defaults", this.salesTargetForm.controls['IsDefault'].value);
    if (this.salesTargetForm.controls['IsDefault'].value == false) {
      this.salesTargetForm.patchValue({ 'MemberID': '' });
    } else {
      this.salesTargetForm.patchValue({ 'MemberID': 0 });
    }

  }

  getworkDaysNo() {
    this.workDaysNo = this.salesTargetForm.value.DaysOfWork;
    if (this.dailyVisitNo != undefined) {
      this.calculateMonthlyVisit = this.workDaysNo * this.dailyVisitNo;
    }
    if (this.DailyNewMinOrderNo != undefined) {
      this.MonthlyNewOrderMinimum = this.workDaysNo * this.DailyNewMinOrderNo;
    }
  }

  getDailyVisitNo() {
    this.dailyVisitNo = this.salesTargetForm.value.DailyVisit;
    if (this.workDaysNo != undefined) {
      this.calculateMonthlyVisit = this.workDaysNo * this.dailyVisitNo;
    }
  }

  getDailyNewMinOrder() {
    this.DailyNewMinOrderNo = this.salesTargetForm.value.DailyNewOrderMinimum;
    if (this.workDaysNo != undefined) {
      this.MonthlyNewOrderMinimum = this.workDaysNo * this.DailyNewMinOrderNo;
    }
  }

  onSubmit() {
    // console.table(this.salesTargetForm.value);
    this.checkDate();
    if (this.salesTargetForm.value.DaysOfWork > 30) {
      alert("Please check Days of work.");
      return;
    }
    this.submitted = true;
    if (this.salesTargetForm.value.IsDefault == false) {
      this.salesTargetForm.patchValue({ 'IsDefault': 0 });
    } else {
      this.salesTargetForm.patchValue({ 'IsDefault': 1 });
    }
    if (this.salesTargetForm.valid) {
      // console.table(this.salesTargetForm.value);
      if (this.IsupdateData == false) {
        this.storeVisitService.NewRMSalesTarget_Insert(this.salesTargetForm.value).subscribe((res: any) => {
          console.log("submit res", res)
          if (res != -1) {
            alert("New RM-Sales-Target configuration is successful.");
            this.clearForm();
            this.router.navigate(['/Home/NewRmSalesTargetList']);
          } else {
            alert("Target already set for selected date");
            this.clearForm();
          }
        })
      }
      if (this.IsupdateData == true) {
        this.storeVisitService.NewRMSalesTarget_Update(this.salesTargetForm.value).subscribe((res) => {
          if (res) {
            alert("RM-Sales-Target update is successful.");
            this.clearForm();
            this.storeVisitService.setUpdateId(0);
            this.router.navigate(['/Home/NewRmSalesTargetList']);
          }
        })
      }
    }
  }

  clearForm() {
    this.submitted = false;
    this.workDaysNo = undefined;
    this.dailyVisitNo = undefined;
    this.DailyNewMinOrderNo = undefined;
    this.calculateMonthlyVisit = undefined;
    this.MonthlyNewOrderMinimum = undefined;
    this.createsalesTargetForm();
  }

  numCheck(event) {
    return (event.charCode == 8 || event.charCode == 0 || event.charCode == 13) ? null : event.charCode >= 48 && event.charCode <= 57
  }

  checkDate() {
    let yr = new Date(this.salesTargetForm.value.WithEffectFrom).getFullYear();
    let mth = new Date(this.salesTargetForm.value.WithEffectFrom).getMonth();
    let dt = new Date(this.salesTargetForm.value.WithEffectFrom).getDate();
    if (yr < new Date().getFullYear()) {
      alert("Previous Year not alloewd");
      this.salesTargetForm.patchValue({ 'WithEffectFrom': undefined });
      return;
    } else if (yr == new Date().getFullYear() && mth < new Date().getMonth()) {
      alert("Previous Month not allowed");
      this.salesTargetForm.patchValue({ 'WithEffectFrom': undefined });
      return;
    } else if (yr == new Date().getFullYear() && mth >= new Date().getMonth() && dt !== 1) {
      alert("Date should be 01 of the month");
      this.salesTargetForm.patchValue({ 'WithEffectFrom': undefined });
      return;
    } else if (yr > new Date().getFullYear() && dt !== 1) {
      alert("Date should be 01 of the month");
      this.salesTargetForm.patchValue({ 'WithEffectFrom': undefined });
      return;
    }
  }

}
