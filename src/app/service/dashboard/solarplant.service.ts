import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {AppConstants} from "../../AppConstants";
import {Observable} from "rxjs";
import {HttpService} from "../core/http.service";
import {DashboardSolaplantModel} from "../../shared/dashboard/solarplant.model";

@Injectable()

export class DashboardSolarplantService extends HttpService<DashboardSolaplantModel[]> {
  constructor(http: HttpClient) {
    super(http, AppConstants.baseDashboardSolarplant);
  }
}
