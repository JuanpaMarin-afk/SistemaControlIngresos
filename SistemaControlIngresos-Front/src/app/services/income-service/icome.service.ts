import { environment } from 'src/environments/URL-API';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class IcomeService {
  constructor(private http: HttpClient) { }

  private baseUrl = environment.url + '/IncomeDistribution';

  getAllIncomeDistribution(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/GetAllIncomes`);
  }

  insertIncomeDistributionAsync(incomeDistribution: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/AddIncome`, incomeDistribution);
  }

  updateIncomeDistributionAsync(incomeDistribution: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/UpdateIncome`, incomeDistribution);
  }

  deleteIncomeDistributionAsync(id_income: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/DeleteIncome/${id_income}`);
  }

  updateDateForUnpaidIncome(incomeDistribution: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/UpdateDateForUnpaidIncome`, incomeDistribution);
  }


}
