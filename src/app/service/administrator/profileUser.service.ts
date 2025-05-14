import { Injectable } from '@angular/core'
import { HttpClient} from '@angular/common/http';
import { AppConstants } from 'src/app/AppConstants';
import {CrudService} from "../core/crud.service";
import {ProfileUserModel, ProfileUserNewModel} from "../../shared/administracao/profileuser.model";
import {Observable} from "rxjs";
import {PageUserNewModel} from "../../shared/administracao/pageuser.model";

@Injectable()
export class ProfileUserService extends CrudService<ProfileUserNewModel> {
  constructor(http: HttpClient) {
    super(http, AppConstants.baseSystemProfileUsers);
  }

  public getProfilesByIdUser(id: number): Observable<ProfileUserModel[]> {
    const url = `${this.baseUrl}/ProfilesByIdUser/${id}`;

    return this.http.get<ProfileUserModel[]>(url, {
      headers: this.getAuthHeaders()
    });
  }
}
