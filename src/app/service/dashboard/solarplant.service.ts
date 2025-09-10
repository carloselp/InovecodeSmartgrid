import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {AppConstants} from "../../AppConstants";
import {Observable} from "rxjs";
import {HttpService} from "../core/http.service";
import {DashboardSolaplantGeracaoModel, DashboardSolaplantGeracaoXOutraMedidaModel, DashboardSolaplantMedicaoModel} from "../../shared/dashboard/solarplant.model";
import {ProfilePageModel} from "../../shared/administracao/profilepage.model";

@Injectable()

export class DashboardSolarplantService extends HttpService<DashboardSolaplantGeracaoModel[]> {
  constructor(http: HttpClient) {
    super(http, AppConstants.baseDashboardSolarplant);
  }

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

  getGeracaoXOutraMedida(id: number, date: string, field: number): Observable<DashboardSolaplantGeracaoXOutraMedidaModel[]> {
    const url = `${this.baseUrl}/GeracaoXOutraMedida?solarplantId=${id}&startDate=${date}&field=${field}`;

    return this.http.get<DashboardSolaplantGeracaoXOutraMedidaModel[]>(url, {
      headers: this.getAuthHeaders()
    });
  }

  getHistoricoMedicao(id: number, date: string, codigo: number): Observable<{ createdAt: string, value: number, name: string }[]> {
    const url = `${this.baseUrl}/Medicao/Historico?solarplantId=${id}&startDate=${date}&fieldNumber=${codigo}`;
    return this.http.get<{ createdAt: string, value: number, name: string }[]>(url, {
      headers: this.getAuthHeaders()
    });
  }
}
