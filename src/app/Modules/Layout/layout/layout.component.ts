import { Component, OnInit } from '@angular/core';
import { AuthorizeService } from 'src/app/Shared/authorize.service';
import { CommonFunc } from 'src/app/Shared/commonFunc';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

	routeURL = location.href;
  displaycontent: boolean = true;
  
  showNotification: boolean = false;

  constructor(private authorizeService: AuthorizeService) {
    var gettoken = localStorage.getItem("token");
    if (!gettoken) {
      this.displaycontent = false;
      return
    }
   }

  ngOnInit(): void {

    this.authorizeService.AuthorizeUserByRole('RetailerShaktiStoreVisitRM').subscribe(
      (res1) => {
        if (res1) {
         this.showNotification = true;
        }
      }, (err: any) => {
        CommonFunc.handleError(err);
      }
    );

  	// console.log('Layout:' +this.routeURL);
  }

}
