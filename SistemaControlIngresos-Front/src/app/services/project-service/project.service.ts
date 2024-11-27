import { environment } from 'src/environments/URL-API';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  constructor(private http: HttpClient) { }

  private baseUrl = environment.url + '/Project';

  getAllProject(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/GetAllProjectAsync`);
  }

  insertProjectAsync(Project: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/InsertProjectAsync`, Project);
  }

  updateProjectAsync(Project: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/UpdateProjectAsync`, Project);
  }
}
