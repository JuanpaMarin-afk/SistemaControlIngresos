import { environment } from 'src/environments/URL-API';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientServiceService {

  constructor(private http: HttpClient) { }

  private baseUrl = environment.url + '/Client';

  getAllClient(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/GetAllClientAsync`);
  }

  insertClientAsync(Client: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/InsertClientAsync`, Client);
  }

  updateClientAsync(Client: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/UpdateClientAsync`, Client);
  }

  toggleClientStatusAsync(Client: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/ToggleClientStatusAsync`, Client);
  }

}
