import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpUrlEncodingCodec } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Authenticate } from './authenticate';
import { Constants } from '../../Shared/constants';

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {

  codec = new HttpUrlEncodingCodec;

  constructor(private http: HttpClient) { }

  AuthenticateUser(authenticate:Authenticate): Observable<Authenticate> {
    return this.http.post<Authenticate>(Constants.apiURL + '/Security/Login',
    authenticate, Constants.httpOptions);
  }  

  ForgotPassword(authenticate:Authenticate): Observable<Authenticate> {
    return this.http.post<Authenticate>(Constants.apiURL + '/Security/ForgotPassword',
    authenticate, Constants.httpOptions);
  }

  UpdatePassword(OldPassword:string, NewPassword:string): Observable<any> {
    return this.http.post<any>(Constants.apiURL + '/Security/UpdatePassword?OldPassword='+this.codec.encodeValue(OldPassword)+'&NewPassword='+this.codec.encodeValue(NewPassword)+'&SessionToken='+localStorage.getItem('token'),
    Constants.httpOptions);
  }

  GetZone(): Observable<any> {
    return this.http.get<any>(Constants.apiURL + '/Security/GetZone?SessionToken='+localStorage.getItem('token'),
    Constants.httpOptions);
  }

  GetActiveZone(): Observable<any> {
    return this.http.get<any>(Constants.apiURL + '/Security/GetActiveZone?SessionToken='+localStorage.getItem('token'),
    Constants.httpOptions);
  }

  SetZone(ZoneID): Observable<any> {
    return this.http.post<any>(Constants.apiURL + '/Security/SetZone?ZoneID='+ZoneID+'&SessionToken='+localStorage.getItem('token'),
    Constants.httpOptions);
  }

  GetRole(RoleName): Observable<any> {
    return this.http.get<any>(Constants.apiURL + '/Security/GetRole?SessionToken='+localStorage.getItem('token')+'&RoleName='+RoleName,
    Constants.httpOptions);
  }

  GetAllowRemovalStatus(): Observable<any> {
    return this.http.get<any>(Constants.apiURL + '/Security/GetAllowRemovalStatus?SessionToken='+localStorage.getItem('token'),
    Constants.httpOptions);
  }

  GetDistrictByState(StateID): Observable<any> {
    return this.http.get<any>(Constants.apiURL + '/Security/GetDistrictByState?StateID='+StateID,
    Constants.httpOptions);
  }

  GetRoleByToken(): Observable<any> {
    return this.http.get<any>(Constants.apiURL + '/Security/GetRoleByToken?SessionToken='+localStorage.getItem('token'),
    Constants.httpOptions);
  }

}
