import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Constants } from '../../Shared/constants';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

	httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  GetStoreVisitDistrictWise(StartDate:string, EndDate:string): Observable<any> {
  	// console.log(StartDate, EndDate, Constants.apiURL);
    return this.http.get(Constants.apiURL + '/RetailerShakti/StoreVisit_Summary_DisrictWise?PStartDate='+StartDate+'&PEndDate='+EndDate+'&SessionToken='+localStorage.getItem('token'),
      this.httpOptions);
  }

  GetStoreVisitROWise(StartDate:string, EndDate:string): Observable<any> {
    // console.log(StartDate, EndDate);
    return this.http.get(Constants.apiURL + '/RetailerShakti/StoreVisit_Summary_ROWise?PStartDate='+StartDate+'&PEndDate='+EndDate+'&SessionToken='+localStorage.getItem('token'),
      this.httpOptions);
  }

  GetStoreVisitRemarkStatus(StartDate:string, EndDate:string): Observable<any> {
    // console.log(StartDate, EndDate);
    return this.http.get(Constants.apiURL + '/RetailerShakti/StoreVisit_RemarkStatus?PStartDate='+StartDate+'&PEndDate='+EndDate+'&SessionToken='+localStorage.getItem('token'),
      this.httpOptions);
  }

  GetOnBoardMonthly(NoOfMonth:number): Observable<any> {
    // console.log(NoOfMonth);
    return this.http.get(Constants.apiURL + '/RetailerShakti/StoreVisit_MonthlyOnBoard?NoOfMonth='+NoOfMonth+'&SessionToken='+localStorage.getItem('token'),
      this.httpOptions);
  }

}
