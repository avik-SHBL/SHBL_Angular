import { Component, OnInit } from '@angular/core';

import { StoreVisitService } from '../../StoreVisit/store-visit.service';
import { InputJsonDatePipe } from '../../../Shared/Pipes/input-json-date.pipe';
import { AuthorizeService } from '../../../Shared/authorize.service';
import { Constants } from '../../../Shared/constants';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { ParseJsonDatePipe } from '../../../Shared/Pipes/parse-json-date.pipe';
import { CommonFunc } from '../../../Shared/commonFunc';

@Component({
  selector: 'app-retailershakti-sales-report',
  templateUrl: './retailershakti-sales-report.component.html',
  styleUrls: ['./retailershakti-sales-report.component.css']
})
export class RetailershaktiSalesReportComponent implements OnInit {

  MonthArr: any = [];
  FinYearArr: any = [];
  RMArr: any = [];
  url: string = '';

  Month: number = 0;
  FinYear: string = '';
  RMID: number = 0;
  Keyword: string = '';
  IsDetailReport: boolean;
  Pincode: string = '';
  constructor(private storeVisitService: StoreVisitService) { }

  ngOnInit(): void {

  	this.PopulateMonth();
  	this.PopulateFinYear();  	
  	this.Set_Current_Month_FinYear();
	this.PopulateRM();
	this.IsDetailReport = false;
  }

  PopulateMonth() {

  	this.MonthArr.push(
  		{'id':1, 'month':'January'},
  		{'id':2, 'month':'February'},
  		{'id':3, 'month':'March'},
  		{'id':4, 'month':'April'},
  		{'id':5, 'month':'May'},
  		{'id':6, 'month':'June'},
  		{'id':7, 'month':'July'},
  		{'id':8, 'month':'August'},
		{'id':9, 'month':'September'},
  		{'id':10, 'month':'October'},
  		{'id':11, 'month':'November'},
  		{'id':12, 'month':'December'},
  	);
  }

  PopulateFinYear() {

  	this.FinYearArr.push(
  		{'id':2021, 'finyear':'2021-2022'},
  		{'id':2022, 'finyear':'2022-2023'},
  		{'id':2023, 'finyear':'2023-2024'},
  		{'id':2024, 'finyear':'2024-2025'},
		{'id':2025, 'finyear':'2025-2026'},
  	);
  }

  PopulateRM() {

    this.storeVisitService.GetRMList(this.Keyword).subscribe(
      (res) => {
        // console.log(res);
        this.RMArr = res;
        if(res.length == 1) {
          this.RMID = res[0].MemberID;
        }
		this.GenerateLostSalesReport();
      }, (err: any) => {
        CommonFunc.handleError(err);
      }
      );
  }

  Set_Current_Month_FinYear() {

  	const dt = new Date();
  	// console.log(dt.toISOString());

  	var curmonth: any = dt.toISOString().split('-')[1];
  	// console.log(curmonth);
  	//var newmonth = curmonth*1  == 1 ? 12 : curmonth*1 - 1;
  	// console.log(newmonth);
  	//this.Month = newmonth;
	  this.Month = curmonth*1;
    //alert (curmonth);
  	var curyear = dt.toISOString().split('-')[0];
 
	if ( curmonth*1>=1 && curmonth*1<=3)
	{
		curyear = (parseInt(curyear)*1-1).toString();
	}
  	// console.log(curyear);
	// alert (curyear);
  	for (var fy of this.FinYearArr) {
  		if(fy.id == curyear) {
			///alert(fy.id);
  			this.FinYear = fy.finyear;
  		}
  	}
  }

  GenerateReport() {
    
  	this.url = Constants.apiURL + '/Report/RetailershaktiSalesReport?Month='+this.Month+'&FinYear='+this.FinYear+'&RMID='+this.RMID+'&IsDetailReport='+(this.IsDetailReport == false ? 0 : 1)+'&Pincode='+this.Pincode+'&SessionToken='+localStorage.getItem('token');
     
}
GenerateAnalysisReport() {
    
	this.url = Constants.apiURL + '/Report/RetailershaktiSalesAnalysis?Month='+this.Month+'&FinYear='+this.FinYear+'&RMID='+this.RMID+'&Pincode='+this.Pincode+'&SessionToken='+localStorage.getItem('token');
   
}
GenerateLostSalesReport() {
    
	this.url = Constants.apiURL + '/Report/RetailershaktiLostSaleReport?Month='+this.Month+'&FinYear='+this.FinYear+'&RMID='+this.RMID+'&Pincode='+this.Pincode+'&SessionToken='+localStorage.getItem('token');
   
}
}
