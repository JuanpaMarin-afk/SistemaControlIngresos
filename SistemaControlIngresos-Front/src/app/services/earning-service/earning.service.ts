import { environment } from 'src/environments/URL-API';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EarningService {
  constructor(private http: HttpClient) { }

  private baseUrl = environment.url + '/Earning';

  getAllEarning(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/GetEarnings`);
  }

  insertEarningAsync(Earning: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/InsertEarningAsync`, Earning);
  }

  updateEarningAsync(Earning: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/UpdateEarningAsync`, Earning);
  }

  deleteEarningAsync(id_earning: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/DeleteEarningAsync/${id_earning}`);
  }

}
