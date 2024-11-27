import { environment } from 'src/environments/URL-API';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  constructor(private http: HttpClient) { }

  private baseUrl = environment.url + '/Logs';

  getAllLogs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/GetAllLogs`);
  }

  insertLogsAsync(Log: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/InsertLogAsync`, Log);
  }

}
