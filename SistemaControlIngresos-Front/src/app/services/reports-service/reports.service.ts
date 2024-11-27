import { environment } from 'src/environments/URL-API';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  constructor(private http: HttpClient) { }

  private baseUrl = environment.url + '/Reports';

  getProjectReportByMonth(dateBegin: string, dateEnd: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/ReportGetProjectReportByMonth`, {
      params: {
        p_start_date: dateBegin.toString(),
        p_end_date: dateEnd.toString()
      }
    });
  }

  getProjectReportByStatus(p_is_facturado: boolean, p_year: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/ReportGetProjectReportByStatus`, {
      params: {
        p_is_facturado: p_is_facturado.toString(),
        p_year: p_year.toString()
      }
    });
  }

  getProjectReportByTypeWorkAndClient(p_type_work_id: number, p_client_id: number, dateBegin: string, dateEnd: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/ReportGetProjectReportByTypeWorkAndClient`, {
      params: {
        p_type_work_id: p_type_work_id.toString(),
        p_client_id: p_client_id.toString(),
        p_start_date: dateBegin.toString(),
        p_end_date: dateEnd.toString()
      }
    });
  }

  getTotalEarningsMinusAmount(p_year: number, p_client_id: number, dateBegin: string, dateEnd: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/ReportGetTotalEarningsMinusAmount`, {
      params: {
        p_year: p_year.toString(),
        p_client_id: p_client_id.toString(),
        p_start_date: dateBegin.toString(),
        p_end_date: dateEnd.toString()
      }
    });
  }

  getEarningsInColones(dateBegin: string, dateEnd: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/ReportGetEarningsInColones`, {
      params: {
        p_start_date: dateBegin.toString(),
        p_end_date: dateEnd.toString()
      }
    });
  }

  getEarningsInDollars(dateBegin: string, dateEnd: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/ReportGetEarningsInDollars`, {
      params: {
        p_start_date: dateBegin.toString(),
        p_end_date: dateEnd.toString()
      }
    });
  }

  getConsolidatedEarningsInColones(dateBegin: string, dateEnd: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/ReportGetConsolidatedEarningsInColones`, {
      params: {
        p_start_date: dateBegin.toString(),
        p_end_date: dateEnd.toString()
      }
    });
  }

  getControlClients(p_year: number, dateBegin: string, dateEnd: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/ReportControlClients`, {
      params: {
        p_year: p_year.toString(),
        p_start_date: dateBegin.toString(),
        p_end_date: dateEnd.toString()
      }
    });
  }

  getProjectSector(p_type_sector: number, dateBegin: string, dateEnd: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/ReportGetProjectReportByTypeSector`, {
      params: {
        p_type_sector: p_type_sector.toString(),
        p_start_date: dateBegin.toString(),
        p_end_date: dateEnd.toString()
      }
    });
  }

  getAllIncomeDistributionReport(dateBegin: string, dateEnd: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/GetAllIncomesReport`, {
      params: {
        p_start_date: dateBegin.toString(),
        p_end_date: dateEnd.toString()
      }
    });
  }

}
