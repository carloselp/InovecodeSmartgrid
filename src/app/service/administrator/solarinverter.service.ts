import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AppConstants} from "../../AppConstants";
import {CrudService} from "../core/crud.service";
import {SolarinverterModel} from "../../shared/administracao/solarinverter.model";
import {Observable} from "rxjs";

@Injectable()
export class SolarinverterService extends CrudService<SolarinverterModel> {
  constructor(http: HttpClient) {
    super(http, AppConstants.baseSolarInverter);
  }

  public getByIdSolarplant(id: number): Observable<SolarinverterModel[]> {
    const url = `${this.baseUrl}/getByIdSolarplant/${id}`;

    return this.http.get<SolarinverterModel[]>(url, {
      headers: this.getAuthHeaders()
    });
  }
}
