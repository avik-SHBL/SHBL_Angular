import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';

export class Constants {
	
 

public static apiURL: string =  "http://localhost:64694/";  

public static siteURL: string = "http://localhost:4200/";

 


	public static httpOptions = {
		headers: new HttpHeaders({ 'Content-Type': 'application/json' })
	};
  
 }
