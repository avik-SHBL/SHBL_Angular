import { Component, OnInit } from '@angular/core';
import { Authenticate } from '../authenticate';
import { AuthenticateService } from '../authenticate.service';
import { Constants } from '../../../Shared/constants';
import { CommonFunc } from '../../../Shared/commonFunc';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  Authenticate: any = {};

  InvalidAuthMsg : string = '';

  InvalidUsernameMsg:boolean = false;

  isMobile: boolean = false;

  constructor(private authenticateService: AuthenticateService, 
    private router: Router) { }

  ngOnInit(): void {
  this.isMobile = window.orientation > -1;
    //console.log(localStorage.getItem('remember-me'));

      if(localStorage.getItem('remember-me') != null && localStorage.getItem('remember-me')) {
      this.Authenticate.RememberMe = localStorage.getItem('remember-me');
      }
      if(localStorage.getItem('login-id') != null && localStorage.getItem('login-id')) {
        this.Authenticate.LoginID = localStorage.getItem('login-id');
      }
      if(localStorage.getItem('password') != null && localStorage.getItem('password')) {
        this.Authenticate.Password = localStorage.getItem('password');
      }    

  }

  Login(Authenticate : any): void {
    // console.log(this.Authenticate);
    if(this.Authenticate != null) {
    this.authenticateService.AuthenticateUser(this.Authenticate).subscribe(
      (res: any) => {
        // console.log(res);
        if(res.Data != null) { 
 
        
          localStorage.setItem('username', res.Data.split('|')[1]);  
          localStorage.setItem('token', res.Data.split('|')[0]);
          localStorage.setItem('apiUrl', Constants.apiURL);
          localStorage.setItem('siteUrl', Constants.siteURL);

          if(this.Authenticate.RememberMe == true) {
            localStorage.setItem('login-id', this.Authenticate.LoginID);
            localStorage.setItem('password', this.Authenticate.Password);
            localStorage.setItem('remember-me', this.Authenticate.RememberMe);
          }
          if(this.isMobile) {
            // location.href = 'Home/RMWiseStoreVisitReport';
            location.href = '/Home/HygieneTracker';
          }
          else
          {
            location.href = 'Home/Dashboard';
          }
          
        }
        else {
          this.InvalidAuthMsg = 'User is invalid';
        }
      }, (err: any) => {
        CommonFunc.handleError(err);
      }
    );
  }
  }

  handleKeyUp(e) {     
    if(e.keyCode === 13){        
      this.Login(this.Authenticate);     
    }
  }  

  SendMail(Username) {
    // console.log(Username);

    if(Username != '') {
      this.Authenticate.LoginID = Username;
      this.authenticateService.ForgotPassword(this.Authenticate).subscribe(
        (res: any) => {
          // console.log(res);
          if(res.Data == 1) {
            alert('Mail sent. Please check your mail inbox.');        
          }
          else {
            alert('Your email is not found. Please contact HBM Technical Team.');       
          }
        }, (err: any) => {
        CommonFunc.handleError(err);
      }
        
        );
    }
    else { this.InvalidUsernameMsg = true; }

  }

}
