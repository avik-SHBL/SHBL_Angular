import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Constants } from '../../Shared/constants';

@Injectable({
  providedIn: 'root'
})
export class LeadMgmtService {

  constructor(private http: HttpClient) { }

  GetState(): Observable<any> {
    return this.http.get(Constants.apiURL + '/LeadMgmt/GetStateList?SessionToken='+localStorage.getItem('token'),
      Constants.httpOptions);
  }

  uploadFile(file: any): Observable<any> {

    const formData: FormData = new FormData();

    formData.append('file', file);

    const req = new HttpRequest('POST', `${Constants.apiURL+'/LeadMgmt'}/UploadFile`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);

  }

  LeadImport_Insert(StateID, StateName, DistrictID, DistrictName, SourceMedia, MediaDetails, FileName, FilePath): Observable<any> {
    return this.http.post(Constants.apiURL + '/LeadMgmt/LeadImport_Insert?StateID='+StateID+'&StateName='+StateName+'&DistrictID='+DistrictID+'&DistrictName='+DistrictName+'&SourceMedia='+SourceMedia+'&MediaDetails='+MediaDetails+'&FileName='+FileName+'&FilePath='+FilePath+'&SessionToken='+localStorage.getItem('token'),
      Constants.httpOptions);
  }

  LeadImport_List(): Observable<any> {
    return this.http.get(Constants.apiURL + '/LeadMgmt/LeadImport_List?SessionToken='+localStorage.getItem('token'),
      Constants.httpOptions);
  }

  LeadImport_Delete(LeadImportID): Observable<any> {
    return this.http.post(Constants.apiURL + '/LeadMgmt/LeadImport_Delete?LeadImportID='+LeadImportID,
      Constants.httpOptions);
  }

  LeadMaster_List(Month, Year, IsMapped, VisitStatus, ShortRemark, StartDate, EndDate, IsReachableBySales, Keyword): Observable<any> {
    return this.http.get(Constants.apiURL + '/LeadMgmt/LeadMaster_List?Month='+Month+'&Year='+Year+'&IsMapped='+IsMapped+'&IsReachableBySales='+IsReachableBySales+'&VisitStatus='+VisitStatus+'&ShortRemark='+ShortRemark+'&StartDate='+StartDate+'&EndDate='+EndDate+'&Keyword='+Keyword+'&SessionToken='+localStorage.getItem('token'),
      Constants.httpOptions);
  }

  Telecaller_List(Keyword): Observable<any> {
    return this.http.get(Constants.apiURL + '/LeadMgmt/Telecaller_List?Keyword='+Keyword+'&SessionToken='+localStorage.getItem('token'),
      Constants.httpOptions);
  }

  MapTelecallerByLead(Map): Observable<any> {
    return this.http.post(Constants.apiURL + '/LeadMgmt/MapTelecaller', Map,
      Constants.httpOptions);
  }

  FreshCalls_List(Month, Year, IsMyCall, Keyword): Observable<any> {
    return this.http.get(Constants.apiURL + '/LeadMgmt/FreshCalls_List?Month='+Month+'&Year='+Year+'&IsMyCall='+IsMyCall+'&Keyword='+Keyword+'&SessionToken='+localStorage.getItem('token'),
      Constants.httpOptions);
  }

  FollowUpCalls_List(Month, Year, IsMyCall, IsMissedFollowUp, Keyword): Observable<any> {
    return this.http.get(Constants.apiURL + '/LeadMgmt/FollowUpCalls_List?Month='+Month+'&Year='+Year+'&IsMyCall='+IsMyCall+'&IsMissedFollowUp='+IsMissedFollowUp+'&Keyword='+Keyword+'&SessionToken='+localStorage.getItem('token'),
      Constants.httpOptions);
  }

  Called_List(Month, Year, IsMyCall, CallingStatus, Keyword): Observable<any> {
    return this.http.get(Constants.apiURL + '/LeadMgmt/Called_List?Month='+Month+'&Year='+Year+'&IsMyCall='+IsMyCall+'&CallingStatus='+CallingStatus+'&Keyword='+Keyword+'&SessionToken='+localStorage.getItem('token'),
      Constants.httpOptions);
  }

  CallHistory_List(LeadID): Observable<any> {
    return this.http.get(Constants.apiURL + '/LeadMgmt/CallHistory_List?LeadID='+LeadID,
      Constants.httpOptions);
  }

  GetEmployee_List(): Observable<any> {
    return this.http.get(Constants.apiURL + '/LeadMgmt/GetEmployee_List?SessionToken='+localStorage.getItem('token'),
      Constants.httpOptions);
  }

  TelecallingStatus_Insert(TelecallingStatus): Observable<any> {
    TelecallingStatus.SessionToken = localStorage.getItem('token');
    return this.http.post(Constants.apiURL + '/LeadMgmt/TelecallingStatus_Insert',TelecallingStatus,
      Constants.httpOptions);
  }

  RetailerLead_SelectOne(LeadID): Observable<any> {
    return this.http.get(Constants.apiURL + '/LeadMgmt/RetailerLead_SelectOne?LeadID='+LeadID,
      Constants.httpOptions);
  }

  RetailerLead_Update(RetailerLead): Observable<any> {
    RetailerLead.SessionToken = localStorage.getItem('token');
    return this.http.post(Constants.apiURL + '/LeadMgmt/RetailerLead_Update',RetailerLead,
      Constants.httpOptions);
  }

  GetAllState(): Observable<any> {
    return this.http.get(Constants.apiURL + '/LeadMgmt/GetAllStateList',
      Constants.httpOptions);
  }

  CommunicationSettings_Insert(CommunicationSettings): Observable<any> {
    return this.http.post(Constants.apiURL + '/LeadMgmt/CommunicationSetting_Insert',CommunicationSettings,
      Constants.httpOptions);
  }

  CommunicationSettings_Update(CommunicationSettings): Observable<any> {
    return this.http.post(Constants.apiURL + '/LeadMgmt/CommunicationSetting_Update',CommunicationSettings,
      Constants.httpOptions);
  }

  CommunicationSettings_SelectOne(SettingID): Observable<any> {
    return this.http.get(Constants.apiURL + '/LeadMgmt/CommunicationSetting_SelectOne?SettingID='+SettingID,
      Constants.httpOptions);
  }

  CommunicationSettings_List(CommunicationSettingsList): Observable<any> {
    return this.http.post(Constants.apiURL + '/LeadMgmt/CommunicationSetting_List', CommunicationSettingsList,
      Constants.httpOptions);
  }

  uploadBanner(file: any): Observable<any> {

    const formData: FormData = new FormData();

    formData.append('file', file);

    const req = new HttpRequest('POST', `${Constants.apiURL+'/LeadMgmt'}/UploadEmailBanner`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);

  }

  GetAllBanners(): Observable<any> {
    return this.http.get(Constants.apiURL + '/LeadMgmt/CommunicationSetting_BannerList', 
      Constants.httpOptions);
  }

  SendSMS(Mobile, Message): Observable<any> {
    return this.http.post(Constants.apiURL + '/LeadMgmt/SendSMS?Mobile='+Mobile+'&Message='+Message,
      Constants.httpOptions);
  }

  SendEmail(EmailAddress, Message, ImageHeader): Observable<any> {
    return this.http.post(Constants.apiURL + '/LeadMgmt/SendEmail?EmailAddress='+EmailAddress+'&Message='+Message+'&ImageHeader='+ImageHeader,
      Constants.httpOptions);
  }

  LeadStatusChangeEmail(LeadId, Activity, LatestRemarks): Observable<any> {
    return this.http.post(Constants.apiURL + '/LeadMgmt/LeadDetailsWithEmails_List?LeadId='+LeadId+'&Activity='+Activity+'&LatestRemarks='+LatestRemarks+'&SessionToken='+localStorage.getItem('token'),
      Constants.httpOptions);
  }

}
