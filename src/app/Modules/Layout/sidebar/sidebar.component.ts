import { Component, OnInit } from '@angular/core';
import { AuthenticateService } from '../../Authentication/authenticate.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {  

	isMobile: boolean = false;

  Rolename:string = '';

  constructor(private authenticateService: AuthenticateService,
    private router: Router) { }

  ngOnInit(): void {

  	this.isMobile = window.orientation > -1;

    this.GetRoleByToken();
  }

  GetRoleByToken() {

    this.authenticateService.GetRoleByToken().subscribe(
      (res: any) => {
        // console.log(res);
        if(res) {
          this.Rolename = res;
        }

      });

  }

}
