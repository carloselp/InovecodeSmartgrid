import { Injectable } from '@angular/core'
import { HttpClient, HttpRequest, HttpHeaders} from '@angular/common/http';
import { AppConstants } from 'src/app/AppConstants';
import {CrudService} from "../core/crud.service";
import {ProfileModel} from "../../shared/administracao/profile.model";


@Injectable()

export class ProfileService extends CrudService<ProfileModel> {
  constructor(http: HttpClient) {
    super(http, AppConstants.baseSystemProfiles);
  }
}
