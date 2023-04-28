import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Constants } from './constants';

@Injectable({
  providedIn: 'root'
})
export class AuthorizeService {

  constructor(private http: HttpClient) { }

  AuthorizeUserByRole(RoleName):Observable<any> {
  	return this.http.get<any>(Constants.apiURL + '/Security/IsAuthorised?Module='+RoleName+'&SessionToken='+localStorage.getItem('token'),
     Constants.httpOptions);
  }

  LogoutUser() {
    return this.http.post(Constants.apiURL + '/Security/Logout?SessionToken='+localStorage.getItem('token'),
    Constants.httpOptions);
  }

}
