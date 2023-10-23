import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Fields } from './fields.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  baseUrl = "http://localhost:3000";
  constructor(private http: HttpClient) { }

  send(fields: Fields):Observable<any> {
    return this.http.post<any>(this.baseUrl,fields);
  }

  // receive():Observable<string>{
  //   return this.http.get<string>(this.baseUrl);
  // }

}
