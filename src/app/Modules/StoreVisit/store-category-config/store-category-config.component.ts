import { Component, OnInit } from '@angular/core';
import { StoreVisitService } from '../store-visit.service';
import { AuthorizeService } from '../../../Shared/authorize.service';
import { Constants } from '../../../Shared/constants';
import { CommonFunc } from '../../../Shared/commonFunc';

@Component({
  selector: 'app-store-category-config',
  templateUrl: './store-category-config.component.html',
  styleUrls: ['./store-category-config.component.css']
})
export class StoreCategoryConfigComponent implements OnInit {

  SalesConfigList: any = [];

  constructor(private storeVisitService: StoreVisitService,
  	private authorizeService: AuthorizeService) { }

  ngOnInit(): void {

  	this.authorizeService.AuthorizeUserByRole('RetailerShaktiStoreVisitAdmin').subscribe(
  		(res  ) => {
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
  		});

  	this.PopulateGrid();

  }

  PopulateGrid() {
  	this.storeVisitService.GetStoreSalesCategoryList().subscribe(
  		(res) => {
  			// console.log(res);        
  			this.SalesConfigList = res;
  		}, (err: any) => {
  			CommonFunc.handleError(err);
  		}
  		);
  }

  onChange_SalesVolume(id) {
  	// console.log(this.SalesConfigList, id);  	

  	let itemIndex = this.SalesConfigList.findIndex(item => item.StoreCatecoryID == id);
  	// console.log(itemIndex);

  	if(itemIndex >= 0 && itemIndex < 5) {
  		this.storeVisitService.StoreSalesCategoryUpdate(this.SalesConfigList[itemIndex]).subscribe(
  			(res) => {
  				// console.log(res);
  				this.PopulateGrid();
  			}, (err: any) => {
  				CommonFunc.handleError(err);
  			}
  			); 	
  	}
  }

}
