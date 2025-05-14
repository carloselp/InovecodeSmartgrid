import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AppConstants} from "../../AppConstants";
import {CrudService} from "../core/crud.service";
import {SolarplantModel} from "../../shared/administracao/solarplant.model";
import {Observable} from "rxjs";
import {PageUserModel} from "../../shared/administracao/pageuser.model";

@Injectable()
export class SolarplantService extends CrudService<SolarplantModel> {
  constructor(http: HttpClient) {
    super(http, AppConstants.baseSolarPlant);
  }
}
