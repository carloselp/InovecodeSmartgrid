import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {AppConstants} from "../../AppConstants";
import {Observable} from "rxjs";
import {HttpService} from "../core/http.service";
import {DashboardSolaplantGeracaoModel, DashboardSolaplantMedicaoModel} from "../../shared/dashboard/solarplant.model";
import {ProfilePageModel} from "../../shared/administracao/profilepage.model";

@Injectable()

export class DashboardSolarplantService extends HttpService<DashboardSolaplantGeracaoModel[]> {
  constructor(http: HttpClient) {
    super(http, AppConstants.baseDashboardSolarplant);
  }
  // public getGeracao(id: number, date: Date): Observable<DashboardSolaplantGeracaoModel[]> {
  //   const url = `${this.baseUrl}/Dashboard/Solarplant/v1/Geracao?solarplantId=${id}`;
  //   const dataFormatada = this.formatDateToYYYYMMDD(date);
  //
  //   const params = new HttpParams().set('startDate', dataFormatada);
  //
  //   return this.http.get<DashboardSolaplantGeracaoModel[]>(url, {
  //     headers: this.getAuthHeaders(),
  //     params: params
  //   });
  // }

  // public getMedicao(id: number, date: Date): Observable<DashboardSolaplantMedicaoModel[]> {
  //   const url = `${this.baseUrl}/Dashboard/Solarplant/v1/Medicao?solarplantId=${id}`;
  //   const dataFormatada = this.formatDateToYYYYMMDD(date);
  //
  //   const params = new HttpParams().set('startDate', dataFormatada);
  //
  //   return this.http.get<DashboardSolaplantMedicaoModel[]>(url, {
  //     headers: this.getAuthHeaders(),
  //     params: params
  //   });
  // }

  getMedicao(id: number, date: string): Observable<DashboardSolaplantMedicaoModel[]> {
    const url = `${this.baseUrl}/Medicao?solarplantId=${id}&startDate=${date}`;

    return this.http.get<DashboardSolaplantMedicaoModel[]>(url, {
      headers: this.getAuthHeaders()
    });
  }

  getGeracao(id: number, date: string): Observable<DashboardSolaplantGeracaoModel[]> {
    const url = `${this.baseUrl}/Geracao?solarplantId=${id}&startDate=${date}`;

    return this.http.get<DashboardSolaplantGeracaoModel[]>(url, {
      headers: this.getAuthHeaders()
    });
  }
}
