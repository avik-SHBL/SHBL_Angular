import { Component, OnInit } from '@angular/core';
import { Constants } from '../../../Shared/constants';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-store-visit-details-report',
  templateUrl: './store-visit-details-report.component.html',
  styleUrls: ['./store-visit-details-report.component.css']
})
export class StoreVisitDetailsReportComponent implements OnInit {  

	// url : string = '';

  constructor(private activatedRoute:ActivatedRoute) { }

  ngOnInit(): void {
  	// let params = new URLSearchParams(window.location.search);
  	// console.log(params.get('DistrictID'));
  	// var StartDate = params.get('StartDate');
  	// var EndDate = params.get('EndDate');
  	// var UserID = params.get('UserID');
  	// var DistrictID = params.get('DistrictID') == '' ? 0 : params.get('DistrictID');
  	// var iLocation = params.get('Location') == '' ? '' : params.get('Location');
  	// var ShortRemark = params.get('ShortRemark') == '' ? '' : params.get('ShortRemark');

  	// this.url = Constants.apiURL + 'Report/StoreVisitDetailsReport?StartDate='+StartDate+'&EndDate='+EndDate+'&UserID='+63+'&DistrictID='+0+'&Location='+iLocation+'&ShortRemark='+ShortRemark+'&SessionToken='+localStorage.getItem('token');
  }

}
