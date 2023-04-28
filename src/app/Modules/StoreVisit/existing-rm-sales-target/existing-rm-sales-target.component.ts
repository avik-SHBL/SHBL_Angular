import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms'
import { StoreVisitService } from '../store-visit.service';
import { CommonFunc } from 'src/app/Shared/commonFunc';
import { Router } from '@angular/router';
import { AuthorizeService } from 'src/app/Shared/authorize.service';
import { Constants } from 'src/app/Shared/constants';

@Component({
  selector: 'app-existing-rm-sales-target',
  templateUrl: './existing-rm-sales-target.component.html',
  styleUrls: ['./existing-rm-sales-target.component.css']
})
export class ExistingRmSalesTargetComponent implements OnInit {

  ExRmTarget: boolean = false;

  ExsalesTargetForm: FormGroup;
  submitted = false;
  isDisabled: boolean = false;
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
  MNVC: any;
  MEVC: any;
  NVP: any;
  EVP: any;

  ExupdateId: any;
  isEditable: boolean = false;
  IsupdateData: boolean = false;
  allowInactive: boolean = true;

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
      } else {
        this. ExRmTarget = true;
        this.sessionToken = localStorage.getItem('token')
        this.createExsalesTargetForm();
        this.storeVisitService.data.subscribe((res) => {
          if (res != 0) {
            this.ExupdateId = res;
            // console.log(this.ExupdateId)
            this.editExsalesTargetForm();
          }
        })
        this.GetRMList();
      }
  });
  }

  createExsalesTargetForm() {
    let today = new Date();
    let WEFday = new Date(today.getFullYear(), today.getMonth(), 1);
    this.WithEffectFrom = this.datePipe.transform(WEFday, 'yyyy-MM-dd');
    this.ExsalesTargetForm = this.fb.group({
      IsDefault: [true, Validators.required],
      AllowPotentialRetailerVisit: [false, Validators.required],
      AllowCategoryWiseVisit: [false, Validators.required],
      AllowLostSale: [false, Validators.required],
      Allow3MonthInactiveVisit: [false, Validators.required],
      WithEffectFrom: [this.WithEffectFrom, Validators.required],
      MemberID: [0, Validators.required],
      VisitType: [3, Validators.required],
      DaysOfWork: ['', Validators.required],
      DailyVisit: ['', Validators.required],
      MonthlyVisit: ['', Validators.required],
      DailyNewOrderMinimum: ['', Validators.required],
      MonthlyNewOrderMinimum: ['', Validators.required],
      MonthlyNewVisitCount: ['', Validators.required],
      MonthlyExistingVisitCount: ['', Validators.required],
      NewVisitPercentage: ['', Validators.required],
      ExistingVisitPercentage: ['', Validators.required],
      MonthlyOnBoard: ['', Validators.required],
      InactiveToActiveCount: [0, Validators.required],
      ExpectedMonthlySale: ['', Validators.required],
      SalesTargetID: [''],
      SessionToken: [this.sessionToken, Validators.required]
    });
  }

  get f() { return this.ExsalesTargetForm.controls; }

  editExsalesTargetForm() {
    this.storeVisitService.GetExistingRMSalesTargetBySalesTargetID(this.ExupdateId).subscribe((resp) => {
      console.log("to be update", resp);
      let d = resp[0];
      if (resp) {
        this.ExsalesTargetForm.patchValue({ 'IsDefault': d.IsDefault });
        this.ExsalesTargetForm.patchValue({ 'AllowPotentialRetailerVisit': d.AllowPotentialRetailerVisit });
        this.ExsalesTargetForm.patchValue({ 'AllowCategoryWiseVisit': d.AllowCategoryWiseVisit });
        this.ExsalesTargetForm.patchValue({ 'AllowLostSale': d.AllowLostSale });
        this.ExsalesTargetForm.patchValue({ 'Allow3MonthInactiveVisit': d.Allow3MonthInactiveVisit });
        this.ExsalesTargetForm.patchValue({ 'WithEffectFrom': d.WithEffectFrom });
        this.ExsalesTargetForm.patchValue({ 'MemberID': d.MemberID });
        this.ExsalesTargetForm.patchValue({ 'VisitType': d.VisitType });
        this.ExsalesTargetForm.patchValue({ 'DaysOfWork': d.DaysOfWork });
        this.ExsalesTargetForm.patchValue({ 'DailyVisit': d.DailyVisit });
        this.ExsalesTargetForm.patchValue({ 'MonthlyVisit': d.MonthlyVisit });
        this.ExsalesTargetForm.patchValue({ 'DailyNewOrderMinimum': d.DailyNewOrderMinimum });
        this.ExsalesTargetForm.patchValue({ 'MonthlyNewOrderMinimum': d.MonthlyNewOrderMinimum });
        this.ExsalesTargetForm.patchValue({ 'MonthlyNewVisitCount': d.MonthlyNewVisitCount });
        this.ExsalesTargetForm.patchValue({ 'MonthlyExistingVisitCount': d.MonthlyExistingVisitCount });
        this.ExsalesTargetForm.patchValue({ 'NewVisitPercentage': d.NewVisitPercentage });
        this.ExsalesTargetForm.patchValue({ 'ExistingVisitPercentage': d.ExistingVisitPercentage });
        this.ExsalesTargetForm.patchValue({ 'MonthlyOnBoard': d.MonthlyOnBoard });
        this.ExsalesTargetForm.patchValue({ 'InactiveToActiveCount': d.InactiveToActiveCount });
        this.ExsalesTargetForm.patchValue({ 'ExpectedMonthlySale': d.ExpectedMonthlySale });
        this.ExsalesTargetForm.patchValue({ 'SalesTargetID': d.SalesTargetID });

        this.workDaysNo = d.DaysOfWork;
        this.dailyVisitNo = d.DailyVisit;
        this.calculateMonthlyVisit = d.MonthlyVisit;
        this.DailyNewMinOrderNo = d.DailyNewOrderMinimum;
        this.MonthlyNewOrderMinimum = d.MonthlyNewOrderMinimum;
        this.isEditable = true;
        this.IsupdateData = true;
        if(d.VisitType != 3){
          this.getVisitType();
        }
        if(d.Allow3MonthInactiveVisit == 1){
          this.allowInactive = false;
        }
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
    // console.log("change Defaults", this.ExsalesTargetForm.controls['IsDefault'].value);
    if (this.ExsalesTargetForm.controls['IsDefault'].value == false) {
      this.ExsalesTargetForm.patchValue({ 'MemberID': '' });
    } else {
      this.ExsalesTargetForm.patchValue({ 'MemberID': 0 });
    }
  }

  getVisitType() {
    // console.log("visit type", this.ExsalesTargetForm.value.VisitType);
    let vType = this.ExsalesTargetForm.value.VisitType;
    if (vType == 1) {
      this.ExsalesTargetForm.patchValue({ 'NewVisitPercentage': 100 });
      this.isDisabled = true;
    }
    if (vType == 2) {
      this.ExsalesTargetForm.patchValue({ 'NewVisitPercentage': 0 });
      this.isDisabled = true;
    }
    if (vType == 3) {
      this.isDisabled = false;
      this.ExsalesTargetForm.patchValue({ 'NewVisitPercentage': undefined });
      this.ExsalesTargetForm.patchValue({ 'ExistingVisitPercentage': undefined });
      this.ExsalesTargetForm.patchValue({ 'MonthlyNewVisitCount': undefined });
      this.ExsalesTargetForm.patchValue({ 'MonthlyExistingVisitCount': undefined });
    }
    this.setPercentage()
  }

  getworkDaysNo() {
    this.workDaysNo = this.ExsalesTargetForm.value.DaysOfWork;
    if (this.dailyVisitNo != undefined) {
      this.calculateMonthlyVisit = this.workDaysNo * this.dailyVisitNo;
      this.setPercentage();
    }
    if (this.DailyNewMinOrderNo != undefined) {
      this.MonthlyNewOrderMinimum = this.workDaysNo * this.DailyNewMinOrderNo;
    }
  }

  getDailyVisitNo() {
    this.dailyVisitNo = this.ExsalesTargetForm.value.DailyVisit;
    if (this.workDaysNo != undefined) {
      this.calculateMonthlyVisit = this.workDaysNo * this.dailyVisitNo;
      this.setPercentage();
    }
  }

  getDailyNewMinOrder() {
    this.DailyNewMinOrderNo = this.ExsalesTargetForm.value.DailyNewOrderMinimum;
    if (this.workDaysNo != undefined) {
      this.MonthlyNewOrderMinimum = this.workDaysNo * this.DailyNewMinOrderNo;
    }
  }

  setPercentage() {
    this.NVP = this.ExsalesTargetForm.value.NewVisitPercentage;
    // console.log("this.NVP", this.NVP);
    if (this.NVP != undefined || this.NVP != null) {
      this.EVP = 100 - this.NVP;
      let val = (this.NVP / 100) * this.calculateMonthlyVisit;
      this.MNVC = Math.trunc(val);
      this.MEVC = this.calculateMonthlyVisit - this.MNVC;
      this.ExsalesTargetForm.patchValue({ 'ExistingVisitPercentage': this.EVP });
      this.ExsalesTargetForm.patchValue({ 'MonthlyNewVisitCount': this.MNVC });
      this.ExsalesTargetForm.patchValue({ 'MonthlyExistingVisitCount': this.MEVC });
    } else {
      this.ExsalesTargetForm.patchValue({ 'ExistingVisitPercentage': undefined });
      this.ExsalesTargetForm.patchValue({ 'MonthlyNewVisitCount': undefined });
      this.ExsalesTargetForm.patchValue({ 'MonthlyExistingVisitCount': undefined });
    }
  }

  onSubmit() {
    // console.table("before api", this.ExsalesTargetForm.value);
    this.checkDate();
    if (this.ExsalesTargetForm.value.DaysOfWork > 30) {
      alert("Please check Days of work.");
      return;
    }
    this.submitted = true;

    this.setValue();

    if (this.ExsalesTargetForm.valid) {
      if (this.IsupdateData == false) {
        // console.table("add existing", this.ExsalesTargetForm.value);
        this.storeVisitService.ExistingRMSalesTarget_Insert(this.ExsalesTargetForm.value).subscribe((res: any) => {
          // console.log(res);
          if (res != -1) {
            alert("Existing RM-Sales-Target configuration is successful.");
            this.clearForm();
            this.router.navigate(['/Home/ExistingRmSalesTargetList']);
          } else {
            alert("Target already set for selected date");
            this.clearForm();
          }
        })
      }
      if (this.IsupdateData == true) {
        this.storeVisitService.ExistingRMSalesTarget_Update(this.ExsalesTargetForm.value).subscribe((res: any) => {
          if (res) {
          alert("RM-Sales-Target update is successful.");
          this.clearForm();
          this.storeVisitService.setUpdateId(0);
          this.router.navigate(['/Home/ExistingRmSalesTargetList']);
          }
        })
      }
    }
  }

  setValue() {
    if (this.ExsalesTargetForm.value.IsDefault == false) {
      this.ExsalesTargetForm.patchValue({ 'IsDefault': 0 });
    } else {
      this.ExsalesTargetForm.patchValue({ 'IsDefault': 1 });
    }
    if (this.ExsalesTargetForm.value.AllowPotentialRetailerVisit == false) {
      this.ExsalesTargetForm.patchValue({ 'AllowPotentialRetailerVisit': 0 });
    } else {
      this.ExsalesTargetForm.patchValue({ 'AllowPotentialRetailerVisit': 1 });
    }
    if (this.ExsalesTargetForm.value.AllowCategoryWiseVisit == false) {
      this.ExsalesTargetForm.patchValue({ 'AllowCategoryWiseVisit': 0 });
    } else {
      this.ExsalesTargetForm.patchValue({ 'AllowCategoryWiseVisit': 1 });
    }
    if (this.ExsalesTargetForm.value.AllowLostSale == false) {
      this.ExsalesTargetForm.patchValue({ 'AllowLostSale': 0 });
    } else {
      this.ExsalesTargetForm.patchValue({ 'AllowLostSale': 1 });
    }
    if (this.ExsalesTargetForm.value.Allow3MonthInactiveVisit == false) {
      this.ExsalesTargetForm.patchValue({ 'Allow3MonthInactiveVisit': 0 });
    } else {
      this.ExsalesTargetForm.patchValue({ 'Allow3MonthInactiveVisit': 1 });
    }
  }

  clearForm() {
    this.submitted = false;
    this.workDaysNo = undefined;
    this.dailyVisitNo = undefined;
    this.DailyNewMinOrderNo = undefined;
    this.calculateMonthlyVisit = undefined;
    this.MonthlyNewOrderMinimum = undefined;
    this.NVP = undefined;
    this.isDisabled = false;
    this.createExsalesTargetForm();
  }

  numCheck(event) {
    return (event.charCode == 8 || event.charCode == 0 || event.charCode == 13) ? null : event.charCode >= 48 && event.charCode <= 57
  }

  checkDate() {
    let yr = new Date(this.ExsalesTargetForm.value.WithEffectFrom).getFullYear();
    let mth = new Date(this.ExsalesTargetForm.value.WithEffectFrom).getMonth();
    let dt = new Date(this.ExsalesTargetForm.value.WithEffectFrom).getDate();
    if (yr < new Date().getFullYear()) {
      alert("Previous Year not alloewd");
      this.ExsalesTargetForm.patchValue({ 'WithEffectFrom': undefined });
      return;
    } else if (yr == new Date().getFullYear() && mth < new Date().getMonth()) {
      alert("Previous Month not allowed");
      this.ExsalesTargetForm.patchValue({ 'WithEffectFrom': undefined });
      return;
    } else if (yr == new Date().getFullYear() && mth >= new Date().getMonth() && dt !== 1) {
      alert("Date should be 01 of the month");
      this.ExsalesTargetForm.patchValue({ 'WithEffectFrom': undefined });
      return;
    } else if (yr > new Date().getFullYear() && dt !== 1) {
      alert("Date should be 01 of the month");
      this.ExsalesTargetForm.patchValue({ 'WithEffectFrom': undefined });
      return;
    }
  }

  setInactive(){
    // console.log(this.allowInactive)
    if(this.allowInactive == true){
      this.allowInactive =false;
      this.ExsalesTargetForm.patchValue({ 'InactiveToActiveCount': undefined });
    }else {
      this.allowInactive = true;
      this.ExsalesTargetForm.patchValue({ 'InactiveToActiveCount': 0 });
    }
  }

}