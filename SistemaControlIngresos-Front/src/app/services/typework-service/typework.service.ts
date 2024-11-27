import { environment } from 'src/environments/URL-API';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TypeworkService {
  constructor(private http: HttpClient) { }

  private baseUrl = environment.url + '/TypeWork';

  getAllTypeWork(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/GetAllTypeWorkAsync`);
  }

  insertTypeWorkAsync(TypeWork: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/InsertTypeWorkAsync`, TypeWork);
  }

  updateTypeWorkAsync(TypeWork: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/UpdateTypeWorkAsync`, TypeWork);
  }

  toggleTypeWorkStatusAsync(TypeWork: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/ToggleTypeWorkStatusAsync`, TypeWork);
  }
}
