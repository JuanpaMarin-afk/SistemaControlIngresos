import { environment } from 'src/environments/URL-API';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientTypeServiceService {

  constructor(private http: HttpClient) { }

  private baseUrl = environment.url + '/TypeClient';

  getAllTypeClient(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/GetAllTypeClient`);
  }

  insertTypeClientAsync(TypeClient: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/InsertTypeClientAsync`, TypeClient);
  }

  updateTypeClientAsync(TypeClient: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/UpdateTypeClientAsync`, TypeClient);
  }

  toggleTypeClientStatusAsync(TypeClient: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/ToggleTypeClientStatusAsync`, TypeClient);
  }

}
