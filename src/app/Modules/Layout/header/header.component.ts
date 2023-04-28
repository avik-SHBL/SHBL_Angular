import { Component, OnInit } from '@angular/core';
import { AuthorizeService } from '../../../Shared/authorize.service';
import { Constants } from '../../../Shared/constants';
import { AuthenticateService } from '../../Authentication/authenticate.service';
import { CommonFunc } from '../../../Shared/commonFunc';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

	username: any;
  CP:any = {};

  ShowCP:boolean = false;
  ConfirmPasswordMatchMsg: boolean = false;

  ZoneList: any = [];
  ZoneID: number = 0;

  constructor(private authorizeService: AuthorizeService,
    private authenticateService: AuthenticateService,
    private router: Router) { }

  ngOnInit(): void {

  	if(localStorage.getItem('username') != null) {
  		this.username = localStorage.getItem('username');
  	}
    this.PopulateZoneDrpdwn();
  }

  PopulateZoneDrpdwn() {

    this.authenticateService.GetZone().subscribe(
      (res) => {
        // console.log(res);  
        this.ZoneList = res;   
        if(res.length > 0 && res.length == 1) {
          this.ZoneID = res[0].ZoneID;
        }
        else if(res.length > 0) {
          this.authenticateService.GetActiveZone().subscribe(
            (res1) => {
              // console.log(res1);  
              this.ZoneID = res1;
            }, (err: any) => {
              CommonFunc.handleError(err);
            });
        }
      }, (err: any) => {
        CommonFunc.handleError(err);
      });

  }

  SetZone(ZoneID) {
    // console.log(ZoneID);
    this.authenticateService.SetZone(ZoneID).subscribe(
      (res) => {
        // console.log(res);  
        // console.log(this.router.url);
        let currentUrl = this.router.url;
        location.href = currentUrl;
        // location.href = 'Home/Dashboard';
      }, (err: any) => {
        CommonFunc.handleError(err);
      });
  }

  Logout() {
    
    this.authorizeService.LogoutUser().subscribe(
      (res) => {
        // console.log(res);        
      }, (err: any) => {
        CommonFunc.handleError(err);
      });
    localStorage.removeItem('token');
    location.href = Constants.siteURL;
  }

  ChangePassword() {
    this.ShowCP = !this.ShowCP;
  }

  onChangeConfirmPassword() {
    
    if(this.CP.NewPassword !== this.CP.ConfirmPassword) {
      this.ConfirmPasswordMatchMsg = true;
    }
    else { this.ConfirmPasswordMatchMsg = false; }
  }

  UpdatePassword() {

    if(this.CP.ConfirmPassword != null) {
      
      if (this.CP.NewPassword === this.CP.ConfirmPassword) {
        this.authenticateService.UpdatePassword(this.CP.OldPassword, this.CP.NewPassword).subscribe(
          (res) =>  {
            //console.log(res);
            if (res.Data == 9) {
              alert('Sorry, invalid information! Password cannot be changed.');
            }
            else {
              alert('Password changed successfully. Please login again...');
              this.Logout();
            }
          }, (err: any) => {
            CommonFunc.handleError(err);
          });
      }
    }
  }

  HideChangePassword() {
    this.ShowCP = false;
  }

  // SearchPage(page) {

  //   // console.log(page);
  //   if(page != null) {
  //     location.href='Home/'+page;
  //   }

  // }

}
