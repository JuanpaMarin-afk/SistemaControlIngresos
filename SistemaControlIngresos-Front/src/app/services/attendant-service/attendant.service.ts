import { environment } from 'src/environments/URL-API';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AttendantService {
  constructor(private http: HttpClient) { }

  private baseUrl = environment.url + '/Attendant';

  getAllAttendants(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/GetAllAttendants`);
  }

  insertAttendantAsync(attendant: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/InsertAttendantAsync`, attendant);
  }

  updateAttendantAsync(attendant: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/UpdateAttendantAsync`, attendant);
  }

  toggleAttendantStatusAsync(attendant: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/ToggleAttendantStatusAsync`, attendant);
  }
}
