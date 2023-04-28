import { Component, OnInit } from '@angular/core';
import { StoreVisitService } from '../store-visit.service';
import { CommonFunc } from '../../../Shared/commonFunc';
import { Router } from '@angular/router';
import { Constants } from 'src/app/Shared/constants';
import { AuthorizeService } from 'src/app/Shared/authorize.service';

@Component({
  selector: 'app-new-rm-sales-target-list',
  templateUrl: './new-rm-sales-target-list.component.html',
  styleUrls: ['./new-rm-sales-target-list.component.css']
})
export class NewRmSalesTargetListComponent implements OnInit {
  NewRmList: boolean = false;
  Search: string = '';
  NewRMSalesTargetList: any = [];
  page: number = 1;
  notFound: boolean = false;

  constructor(private storeVisitService: StoreVisitService, private router: Router, private authorizeService: AuthorizeService) { }

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
        this.NewRmList = true;
        this.PopulateGrid();
      }
    });
  }

  PopulateGrid() {
    this.storeVisitService.GetNewRMSalesTargetList(this.Search).subscribe(
      (res) => {
        if(res.length > 0){
          this.NewRMSalesTargetList = res;
          this.notFound = false;
        }else{
          this.notFound = true;
        }
      }, (err: any) => {
        CommonFunc.handleError(err);
      }
    );
  }

  setEdit(setId: any) {
    // console.log("id", setId);
    this.storeVisitService.setUpdateId(setId);
    this.router.navigate(['/Home/NewRmSalesTarget']);
  }

  Delete(SalesTargetID) {
    if (confirm('Are you sure that you want to delete this particular record?')) {
      this.storeVisitService.NewRMSalesTarget_Delete(SalesTargetID).subscribe(
        (res) => {
          // console.log(res);
          if (res == 0) {
            this.PopulateGrid();
          }
          else {
            alert("Past configuration can't be deleted.");
          }
        }, (err: any) => {
          CommonFunc.handleError(err);
        }
      );
    }
  }

  onPageChange(pagenumber) {
    // console.log(val);
    this.page = pagenumber;
  }

}