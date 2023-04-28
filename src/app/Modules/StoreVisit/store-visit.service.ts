import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { StoreVisit } from './store-visit/store-visit';
import { Constants } from '../../Shared/constants';
import { InputJsonDatePipe } from '../../Shared/Pipes/input-json-date.pipe';
import { RMVisitScheduleConfig } from './rm-visit-schedule-config/rm-visit-schedule-config';
import { GiftReceivedAtBranchModel } from './gift-received-at-branch/gift-received-at-branch';
import { GiftReceivedByRMModel } from './gift-received-by-rm/gift-received-by-rm';
import { NewRMSalesTarget } from './new-rm-sales-target/new-rm-sales-target';
import { ExistingRMSalesTarget } from './existing-rm-sales-target/existing-rm-sales-target';

@Injectable({
  providedIn: 'root'
})
export class StoreVisitService {
  private salesTargetId: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  data: Observable<number> = this.salesTargetId.asObservable();

  constructor(private http: HttpClient) { }
  setUpdateId(data: number) {
    this.salesTargetId.next(data);
  }
  /*----------Store Visit START----------*/

  GetDistrict(): Observable<any> {
    return this.http.get(Constants.apiURL + '/RetailerShakti/GetDistrictByZone?SessionToken='+localStorage.getItem('token'),
      Constants.httpOptions);
  }

  GetStoreVisitList(StartDate:string, EndDate:string, Keyword:string): Observable<any> {
  	// console.log(StartDate, EndDate, Keyword);
    return this.http.get(Constants.apiURL + '/RetailerShakti/StoreVisit_List?PStartDate='+StartDate+'&PEndDate='+EndDate+'&Keyword='+Keyword+'&SessionToken='+localStorage.getItem('token'),
      Constants.httpOptions);
  }

  AddStoreVisit(StoreVisit: StoreVisit): Observable<StoreVisit> { 
    console.log(StoreVisit);
    return this.http.post<StoreVisit>(Constants.apiURL + '/RetailerShakti/StoreVisit_Insert',
      StoreVisit, Constants.httpOptions);
  }

  UpdateStoreVisit(StoreVisit: StoreVisit): Observable<StoreVisit> {
    return this.http.post<StoreVisit>(Constants.apiURL + '/RetailerShakti/StoreVisit_Update',
      StoreVisit, Constants.httpOptions);
  }

  GetStoreVisitById(StoreVisitID:number) {
    return this.http.get(Constants.apiURL + '/RetailerShakti/StoreVisit_SelectOne?StoreVisitID='+StoreVisitID,
      Constants.httpOptions);
      
  }

  DeleteStoreVisitById(StoreVisitID:number) {
    return this.http.post(Constants.apiURL + '/RetailerShakti/StoreVisit_Delete?StoreVisitID='+StoreVisitID,
      Constants.httpOptions);
      
  }

  CapturePic(file: any, StoreVisitID): Observable<any> {
    //alert("From serviceTS passing:" +file+" StoreVisitID:"+StoreVisitID)
    const formData: FormData = new FormData();

    formData.append('file', file);
    ///formData.append('StoreVisitID', StoreVisitID);
    ///this.http.post(Constants.apiURL + '/RetailerShakti/CaptureImage',formData,Constants.httpOptions);
    const req = new HttpRequest('POST', `${Constants.apiURL+'/RetailerShakti'}/CaptureImage?StoreVisitID=`+StoreVisitID, formData,  {
      reportProgress: true,
      responseType: 'json'
    });
    //alert("From serviceTS return:" +req)
     return this.http.request(req);

  }

  /*----------Store Visit END----------*/

  /*----------RM Visit Schedular START----------*/

  GetRMList(Keyword): Observable<any> {
    return this.http.get(Constants.apiURL + '/RetailerShakti/GetAllRevenueOfficer_List?Keyword=' + Keyword+'&SessionToken='+localStorage.getItem('token'),
      Constants.httpOptions);
  }

  GetRMVisitScheduleCalendar(UserID, Month): Observable<any> {
    return this.http.get(Constants.apiURL + '/RetailerShakti/RMVisitScheduleCalendar?ROID=' + UserID + '&MonthNo=' + Month,
      Constants.httpOptions);
  }

  /*----------RM Visit Schedular END----------*/

  /*----------RM Visit Schedule Config START----------*/

  AddRMScheduleConfig(RMVisitScheduleConfig : RMVisitScheduleConfig): Observable<RMVisitScheduleConfig> {
    // console.log(RMVisitScheduleConfig);
    return this.http.post<RMVisitScheduleConfig>(Constants.apiURL + '/RetailerShakti/VisitScheduleConfig_Insert?ROID=' + RMVisitScheduleConfig.ROID + '&MedicalStoreName=' + (RMVisitScheduleConfig.StoreName == undefined ? '':RMVisitScheduleConfig.StoreName) + '&Location=' + RMVisitScheduleConfig.Location + '&ContactPerson=' + (RMVisitScheduleConfig.ContactPerson == undefined ? '' : RMVisitScheduleConfig.ContactPerson) + '&ContactNo=' + (RMVisitScheduleConfig.ContactNo == undefined ? '' : RMVisitScheduleConfig.ContactNo) + '&Description=' + (RMVisitScheduleConfig.Description == undefined ? '' : RMVisitScheduleConfig.Description) + '&ScheduledVisitDate=' + RMVisitScheduleConfig.ScheduledVisitDate+'&SessionToken='+localStorage.getItem('token'),
      Constants.httpOptions);
  }

  GetRMScheduleConfigList(ROID, ScheduleDate): Observable<any> {
    return this.http.get(Constants.apiURL + '/RetailerShakti/VisitScheduleConfig_List?ROID=' + ROID + '&ScheduledVisitDate=' + ScheduleDate,
      Constants.httpOptions);
  }

  DeleteRMScheduleConfig(ROID, ScheduleID): Observable<any> {
    return this.http.post(Constants.apiURL + '/RetailerShakti/VisitScheduleConfig_Delete?ROID=' + ROID + '&ScheduleID=' + ScheduleID,
      Constants.httpOptions);
  }

  /*----------RM Visit Schedule Config END----------*/

  /*----------Gift To Retailers START----------*/

  GiftToRetailers(Keyword:string,IsGiven:number) {
    return this.http.get(Constants.apiURL + '/RetailerShakti/GiftToRetailers?Keyword='+Keyword+'&IsGiven='+IsGiven+'&SessionToken='+localStorage.getItem('token'),
      Constants.httpOptions);
  }  

  GiftToRetailer_Update(StoreVisitID:number,Filename:string,GiftGivenDate:string,GiftGivenTime:string) {
    return this.http.post(Constants.apiURL + '/RetailerShakti/GiftToRetailer_Update?StoreVisitID=' + StoreVisitID + '&Filename=' + (Filename == null ? '' : Filename) + '&GiftGivenDate=' + GiftGivenDate + '&GiftGivenTime=' + GiftGivenTime,
      Constants.httpOptions);
  }

  uploadFile(file: any): Observable<any> {

    const formData: FormData = new FormData();

    formData.append('file', file);

    const req = new HttpRequest('POST', `${Constants.apiURL+'/RetailerShakti'}/SelectFile`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);

  }

  ChangePic(file: any, StoreVisitID, GiftGivenDate, GiftGivenTime): Observable<any> {

    const formData: FormData = new FormData();

    formData.append('file', file);
    formData.append('StoreVisitID', StoreVisitID);
    formData.append('GiftGivenDate', GiftGivenDate);
    formData.append('GiftGivenTime', GiftGivenTime);

    const req = new HttpRequest('POST', `${Constants.apiURL+'/RetailerShakti'}/UploadPicFile`, formData,  {
      reportProgress: true,
      responseType: 'json'
    });

     return this.http.request(req);

  }

  /*----------Gift To Retailers END----------*/

  /*----------Gift Reveived By Branch START----------*/

  GetGiftReceivedAtBranchList(StartDate:string, EndDate:string) {
    return this.http.get(Constants.apiURL + '/RetailerShakti/GiftReceivedByBranch_List?StartDate='+StartDate+'&EndDate='+EndDate+'&SessionToken='+localStorage.getItem('token'),
      Constants.httpOptions);
  }

  GiftReceivedAtBranch_Insert(giftReceivedAtBranchModel: GiftReceivedAtBranchModel) {
    return this.http.post(Constants.apiURL + '/RetailerShakti/GiftReceivedByBranch_Insert',
     giftReceivedAtBranchModel, Constants.httpOptions);
  }

  GiftReceivedAtBranch_Delete(ReceiptID) {
    return this.http.post(Constants.apiURL + '/RetailerShakti/GiftReceivedByBranch_Delete?ReceiptID='+ReceiptID,
     Constants.httpOptions);
  }

  /*----------Gift Reveived By Branch END----------*/

  /*----------Gift Reveived By RM START----------*/

  GetRevenueOfficerList(Keyword:string) {
    return this.http.get(Constants.apiURL + '/RetailerShakti/GetAllRevenueOfficer_List?Keyword='+(Keyword == null ? '' : Keyword)+'&SessionToken='+localStorage.getItem('token'),
      Constants.httpOptions);
  }

  GetGiftReceivedByRMList(StartDate:string, EndDate:string) {
    return this.http.get(Constants.apiURL + '/RetailerShakti/GiftReceivedByRM_List?StartDate='+StartDate+'&EndDate='+EndDate+'&SessionToken='+localStorage.getItem('token'),
      Constants.httpOptions);
  }

  GiftReceivedByRM_Insert(giftReceivedByRMModel: GiftReceivedByRMModel) {
    return this.http.post(Constants.apiURL + '/RetailerShakti/GiftReceivedByRM_Insert',
     giftReceivedByRMModel, Constants.httpOptions);
  }

  GiftReceivedByRM_Delete(RMReceiptID) {
    return this.http.post(Constants.apiURL + '/RetailerShakti/GiftReceivedByRM_Delete?RMReceiptID='+RMReceiptID,
     Constants.httpOptions);
  }

  /*----------Gift Reveived By RM END----------*/

  /*----------Ro Visit Route START ----------*/

 RMVisitRoute_List(StartDate:string, EndDate:string,Keyword: string,UserID) {

  return this.http.get(Constants.apiURL + '/RetailerShakti/RMVisitRoute_List?PStartDate='+StartDate+'&PEndDate='+EndDate+'&Keyword='+(Keyword == null ? '' : Keyword)+'&ROID=' + (UserID == undefined ? 0 : UserID)+'&SessionToken='+localStorage.getItem('token'),
    Constants.httpOptions);
}

RMVisitRoute_Path(VisitDate:string,UserID){
  return this.http.get(Constants.apiURL + '/RetailerShakti/RMVisitRoute_Path?VisitDate='+VisitDate+'&ROID=' + (UserID == undefined ? 0 : UserID)+'&SessionToken='+localStorage.getItem('token'),
  Constants.httpOptions);

}

 /*----------Ro Visit Route END ----------*/

 VisitedStoreMaster_SelectAll(Search): Observable<any> {
  return this.http.get(Constants.apiURL + '/RetailerShakti/VisitedStoreMaster_SelectAll?Search='+Search+'&SessionToken='+localStorage.getItem('token'),
    Constants.httpOptions);
}

InsertVisitKm(Km, MemberID, VisitDate){
  return this.http.post(Constants.apiURL + '/RetailerShakti/InsertRMVisitKm?Km='+Km+'&MemberID='+MemberID+'&VisitDate='+VisitDate+'&SessionToken='+localStorage.getItem('token'),
    Constants.httpOptions);
}

MemberPinAssociation_Insert(MemberID, PinCode,EffectDate) {
  return this.http.post(Constants.apiURL + '/RetailerShakti/MemberPinAssociation_Insert?MemberID='+MemberID+'&PinCode='+PinCode+'&SessionToken='+localStorage.getItem('token')+'&EffectDate='+EffectDate,
    Constants.httpOptions);
}

GetRMWisePincodeList(MemberID): Observable<any> {
  return this.http.get(Constants.apiURL + '/RetailerShakti/GetRMWisePincode_List?MemberID=' + MemberID,
    Constants.httpOptions);
}

DeletePinAsssociateById(PinAsssociateID:number) {
  return this.http.post(Constants.apiURL + '/RetailerShakti/MemberPinAsssociate_Delete?PinAsssociateID='+PinAsssociateID,
    Constants.httpOptions);

}

TransportationMode_Insert(ModeOfTransport,TravelDate){
  return this.http.post(Constants.apiURL + '/RetailerShakti/TransportationMode_Insert?ModeOfTransport='+ModeOfTransport+'&TravelDate='+TravelDate+'&SessionToken='+localStorage.getItem('token'),
    Constants.httpOptions);
}

TransportationMode_List() {
  return this.http.get(Constants.apiURL + '/RetailerShakti/TransportationMode_List?SessionToken='+localStorage.getItem('token'),
    Constants.httpOptions);
}

TransportModeRegular_Insert(MemberID,ModeOfTransport,EffectDate){
  return this.http.post(Constants.apiURL + '/RetailerShakti/TransportationModeRegular_Insert?MemberID='+MemberID+'&ModeOfTransport='+ModeOfTransport+'&EffectDate='+EffectDate+'&SessionToken='+localStorage.getItem('token'),
    Constants.httpOptions);
}

ReachableLead(Keyword:string,IsVisited:number,InterestedLead:boolean): Observable<any> {
  return this.http.get(Constants.apiURL + '/RetailerShakti/ReachableLead?Keyword='+Keyword+'&IsVisited='+IsVisited+'&SessionToken='+localStorage.getItem('token')+'&InterestedLead=' + (InterestedLead==true?1:0)  ,
    Constants.httpOptions);
}

InputValuesFromLead(LeadID): Observable<any> {
  return this.http.get(Constants.apiURL + '/LeadMgmt/RetailerLead_SelectOne?LeadID='+LeadID,
    Constants.httpOptions);
}

IsPhotoSkipped(StoreVisitID,SkippedUpload): Observable<any> {
  //console.log("Inside service", StoreVisitID," ",SkippedUpload)
  return this.http.post(Constants.apiURL + '/RetailerShakti/PhotoSkipped?StoreVisitID=' + StoreVisitID + '&IsPhotoSkipped=' + SkippedUpload,
  Constants.httpOptions);
}

GetStoreSalesCategoryList(): Observable<any> {
  // console.log(StartDate, EndDate, Keyword);
  return this.http.get(Constants.apiURL + '/RetailerShakti/StoreSalesCategory_List',
    Constants.httpOptions);
}

StoreSalesCategoryUpdate(SalesConfig): Observable<any> {
  // console.log(SalesConfig);
  return this.http.post(Constants.apiURL + '/RetailerShakti/StoreSalesCategory_Update?StoreCategoryID='+SalesConfig.StoreCatecoryID+'&SalesVolumeFrom='+SalesConfig.SalesVolumeFrom+'&SalesVolumeUpto='+SalesConfig.SalesVolumeUpto+'&NoOfVisitsPerMonth='+SalesConfig.NoOfVisitsPerMonth+'&DaysGap='+SalesConfig.DaysGap+'&AllowVisit='+(SalesConfig.AllowVisit == true ? 1:0)+'&PriorityOrder='+SalesConfig.PriorityOrder+'&SessionToken='+localStorage.getItem('token'),
    Constants.httpOptions);
}

NewRMSalesTarget_Insert(NewRMSalesTarget: NewRMSalesTarget): Observable<NewRMSalesTarget> {
  console.log("salestarget service call",NewRMSalesTarget);
  return this.http.post<NewRMSalesTarget>(Constants.apiURL + '/RetailerShakti/NewRMSalesTarget_Insert',
  NewRMSalesTarget, Constants.httpOptions);
}

NewRMSalesTarget_Update(NewRMSalesTarget: NewRMSalesTarget): Observable<NewRMSalesTarget> {
  return this.http.post<NewRMSalesTarget>(Constants.apiURL + '/RetailerShakti/NewRMSalesTarget_Update',
  NewRMSalesTarget, Constants.httpOptions);
}

GetNewRMSalesTargetBySalesTargetID(SalesTargetID:number) {
  return this.http.get(Constants.apiURL + '/RetailerShakti/NewRMSalesTarget_SelectOne?SalesTargetID='+SalesTargetID,
    Constants.httpOptions);
    
}

GetNewRMSalesTargetList(Search:string): Observable<any> {
  // console.log(StartDate, EndDate, Keyword);
  return this.http.get(Constants.apiURL + '/RetailerShakti/NewRMSalesTarget_List?Search='+Search+'&SessionToken='+localStorage.getItem('token'),
    Constants.httpOptions);
}

NewRMSalesTarget_Delete(SalesTargetID): Observable<any> {
  return this.http.post(Constants.apiURL + '/RetailerShakti/NewRMSalesTarget_Delete?SalesTargetID=' + SalesTargetID,
    Constants.httpOptions);
}

ExistingRMSalesTarget_Insert(ExistingRMSalesTarget: ExistingRMSalesTarget): Observable<ExistingRMSalesTarget> {
  // console.log("salestarget service call",ExistingRMSalesTarget);
  return this.http.post<ExistingRMSalesTarget>(Constants.apiURL + '/RetailerShakti/ExistingRMSalesTarget_Insert',
  ExistingRMSalesTarget, Constants.httpOptions);
}

GetExistingRMSalesTargetList(Search:string): Observable<any> {
  return this.http.get(Constants.apiURL + '/RetailerShakti/ExistingRMSalesTarget_List?Search='+Search+'&SessionToken='+localStorage.getItem('token'),
    Constants.httpOptions);
}

GetExistingRMSalesTargetBySalesTargetID(SalesTargetID:number) {
  return this.http.get(Constants.apiURL + '/RetailerShakti/ExistingRMSalesTarget_SelectOne?SalesTargetID='+SalesTargetID,
    Constants.httpOptions);
    
}

ExistingRMSalesTarget_Update(ExistingRMSalesTarget: ExistingRMSalesTarget): Observable<ExistingRMSalesTarget> {
  return this.http.post<ExistingRMSalesTarget>(Constants.apiURL + '/RetailerShakti/ExistingRMSalesTarget_Update',
  ExistingRMSalesTarget, Constants.httpOptions);
}

ExistingRMSalesTarget_Delete(SalesTargetID): Observable<any> {
  return this.http.post(Constants.apiURL + '/RetailerShakti/ExistingRMSalesTarget_Delete?SalesTargetID=' + SalesTargetID,
    Constants.httpOptions);
}

GetPotentialLeadList(MemberID, Search, VisitMonth, VisitYear): Observable<any> {
  return this.http.get(Constants.apiURL + '/RetailerShakti/PotentialRetailer_List?MemberID='+MemberID+'&Search='+Search+'&VisitMonth='+VisitMonth+'&VisitYear='+VisitYear+'&SessionToken='+localStorage.getItem('token'),
    Constants.httpOptions);
}

PotentialRetailerInsert(PotentialLead: any): Observable<any> {
  return this.http.post(Constants.apiURL + '/RetailerShakti/PotentialRetailerProcessed_Insert', PotentialLead, Constants.httpOptions);
}


}
