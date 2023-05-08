import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs'

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': "Basic " + btoa(`Tokeh:1234`)
  })
}


@Injectable({
  providedIn: 'root'
})
export class FlightsService {
  private baseUrl =  'https://opensky-network.org/api/flights/'
  username = "Tokeh";
  password = "1234";

  constructor(private http:HttpClient) { }

  getFlights(begin:string,end:string): Observable<[]> {
    return this.http.get<[]>(`${this.baseUrl}all?begin=${begin}&end=${end}&limit=5`,httpOptions)
  }

  getArrivals(airport:string,begin:string,end:string) : Observable<[]>{
    return this.http.get<[]>(`${this.baseUrl}arrival?airport=${airport}&begin=${begin}&end=${end}`,httpOptions)
  }
  getDeparture(airport:string,begin:string,end:string) : Observable<[]>{
    return this.http.get<[]>(`${this.baseUrl}departure?airport=${airport}&begin=${begin}&end=${end}`,httpOptions)
  }
}
