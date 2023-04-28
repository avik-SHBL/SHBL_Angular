import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthorizeService } from 'src/app/Shared/authorize.service';
import { StoreVisitService } from '../store-visit.service';
import { Router } from '@angular/router';
import { CommonFunc } from 'src/app/Shared/commonFunc';
import { Constants } from 'src/app/Shared/constants';

@Component({
  selector: 'app-potential-retailer-leads',
  templateUrl: './potential-retailer-leads.component.html',
  styleUrls: ['./potential-retailer-leads.component.css']
})
export class PotentialRetailerLeadsComponent implements OnInit {

  PtRtlrCont: boolean = false;
  isMasterSel: boolean = false;
  isloading: boolean = true;
  notFound: boolean = false;
  curMonth: any;
  totalLeadCounts: any;
  PotentialLeadList: any = [];
  MasterLeadList: any = [];
  minMonth: any;
  WithEffectFrom: any;
  selectAll: any;
  RMArr: any = [];
  RMID: number = 0;
  Keyword: string = '';
  Search: string = '';
  VisitMonth: any = 0;
  VisitYear: any = 0;

  constructor(private authorizeService: AuthorizeService, private storeVisitService: StoreVisitService, private datePipe: DatePipe) { }

  ngOnInit(): void {

    this.authorizeService.AuthorizeUserByRole('RetailerShaktiStoreVisitAdmin').subscribe((res) => {
      // console.log(res);
      if (!res) {
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
        this.PtRtlrCont = true;
        this.notFound = false;
        let today = new Date();
        let WEFday = new Date(today.getFullYear(), today.getMonth() + 1, 1);
        let setMinMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        this.curMonth = today.toLocaleString("en-US", { month: "short" });
        this.WithEffectFrom = this.datePipe.transform(WEFday, 'yyyy-MM');
        this.minMonth = this.datePipe.transform(setMinMonth, 'yyyy-MM');
        // console.log(this.WithEffectFrom, this.curMonth );
        this.VisitMonth = new Date(WEFday).getMonth() + 1;
        this.VisitYear = new Date().getFullYear();
        // console.log(this.WithEffectFrom, "vMonth", this.VisitMonth);
        this.PopulateRM();
        this.PopulateGrid();
      }
    });
  }

  PopulateRM() {
    this.storeVisitService.GetRMList(this.Keyword).subscribe(
      (res) => {
        // console.log(res);
        this.RMArr = res;
        if (res.length == 1) {
          this.RMID = res[0].MemberID;
          this.PopulateGrid();
        }
      }, (err: any) => {
        CommonFunc.handleError(err);
      }
    );
  }


  setWithEffectFrom() {
    this.isloading = true;
    this.Search = '';
    this.VisitMonth = new Date(this.WithEffectFrom).getMonth() + 1;
    this.VisitYear = new Date(this.WithEffectFrom).getFullYear();
    // console.log(this.WithEffectFrom, "----", this.VisitMonth, "yr", this.VisitYear);
    this.selectAll = false;
    this.discardAll();
    this.PopulateGrid();
  }

  PopulateGrid() {

    this.storeVisitService.GetPotentialLeadList(this.RMID, this.Search, this.VisitMonth, this.VisitYear).subscribe(
      (res) => {
        if(res.length > 0){
          this.notFound = false;
          for (var l = 0; l < res.length; l++) {
            res[l].isSelected = false;
          }
          this.PotentialLeadList = res;
          this.totalLeadCounts = this.PotentialLeadList.length;
          this.isloading = false;
          // console.log("leadList", this.PotentialLeadList);

        }else{
          this.isloading = false;
          this.notFound = true;
          this.totalLeadCounts = 0;
        }
      }, (err: any) => {
        CommonFunc.handleError(err);
      }
    );
  }

  selectUnselectAll() {
    if (this.selectAll == true) {
      let allSelected: any = [];
      for (var i = 0; i < this.PotentialLeadList.length; i++) {
        allSelected.push({ 'StoreID': this.PotentialLeadList[i].StoreID, 'RemoteCustomerID': this.PotentialLeadList[i].RemoteCustomerID, 'Pincode': this.PotentialLeadList[i].Pincode, 'MemberID': this.RMID, 'StateID': this.PotentialLeadList[i].StateID, 'VisitMonth': this.VisitMonth, 'VisitYear': this.VisitYear, 'SessionToken': localStorage.getItem('token') });
        this.PotentialLeadList[i].isSelected = true;
      }
      this.MasterLeadList = allSelected;
    }
    if (this.selectAll == false) {
      this.discardAll();
    }
  }

  discardAll() {
    this.MasterLeadList = [];
    for (var i = 0; i < this.PotentialLeadList.length; i++) {
      this.PotentialLeadList[i].isSelected = false;
    }
  }

  selectLeadbyID(data: any) {
    // console.log(data.StoreID);
    if (this.RMID == 0) {
      alert("Select RM");
      this.PopulateGrid();
    } else {
      if (data.isSelected == true) {
        this.MasterLeadList.push({ 'StoreID': data.StoreID, 'RemoteCustomerID': data.RemoteCustomerID, 'Pincode': data.Pincode, 'MemberID': this.RMID, 'StateID': data.StateID, 'VisitMonth': this.VisitMonth, 'VisitYear': this.VisitYear, 'SessionToken': localStorage.getItem('token') });
        // console.log("added this.MasterLeadList", this.MasterLeadList);
      }
      if (data.isSelected == false) {
        this.MasterLeadList = this.MasterLeadList.filter(item => item.LeadID !== data.StoreID);
        this.selectAll = false;
        // console.log("removed this.MasterLeadList", this.MasterLeadList);
      }
    }
  }

  changeRM() {
    this.isloading = true;
    this.Search = '';
    this.selectAll = false;
    this.discardAll();
    this.PopulateGrid();
  }

  GenerateLead() {
    if (this.RMID == 0) {
      alert("PLease Select RM !");
      return;
    } else if (this.MasterLeadList.length == 0) {
      alert("No lead selected !")
    } else {
      // console.log("final submit", this.MasterLeadList)
      if (this.MasterLeadList.length > 0) {
        this.storeVisitService.PotentialRetailerInsert(this.MasterLeadList).subscribe((res)=>{
          // console.log(res)
          if(res == 1) {
            alert("data updated successfull");
            this.RMID = 0;
            this.ngOnInit();
          }
        })
      }
    }
  }

}