import { environment } from 'src/environments/URL-API';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  private baseUrl = environment.url + '/User';

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/GetAllUsers`);
  }

  verifyUserPassword(User: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/VerifyUserPassword`, User);
  }

  insertUserAsync(User: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/InsertUser`, User);
  }

  updateUserAsync(User: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/UpdateUserAsync`, User);
  }

  toggleUserStatusAsync(User: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/ToggleUserStatus`, User);
  }

}
