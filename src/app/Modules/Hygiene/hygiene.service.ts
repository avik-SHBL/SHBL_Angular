import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HygieneModel } from './daily-hygiene/hygieneModel';
import { Constants } from '../../Shared/constants';

@Injectable({
  providedIn: 'root'
})
export class HygieneService {

  constructor(private http: HttpClient) { }

  duplicateEntry():Observable<any> {
  	return this.http.post<any>(Constants.apiURL + '/RetailerShakti/Presentability_UpdateStatus?SessionToken='+localStorage.getItem('token'),
     Constants.httpOptions);
  }

  AddDailyHygiene(HygieneModel: HygieneModel): Observable<HygieneModel> {
    return this.http.post<HygieneModel>(Constants.apiURL + '/RetailerShakti/PresentabilityTracker_Insert',
      HygieneModel, Constants.httpOptions);
  }

  CapturePic(file: any): Observable<any> {
    const formData: FormData = new FormData();

    formData.append('file', file);
    const req = new HttpRequest('POST', `${Constants.apiURL + '/RetailerShakti'}/CaptureImageForPresentability`, formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);

  }
}
