import { Injectable } from '@angular/core'
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs'
import { AppConstants } from 'src/app/AppConstants';
import {CrudService} from "../core/crud.service";
import {ProfilePageModel} from "../../shared/administracao/profilepage.model";

@Injectable()
export class ProfilePageService extends CrudService<ProfilePageModel> {
  constructor(http: HttpClient) {
    super(http, AppConstants.baseSystemPageProfiles);
  }

  public getPagesByIdProfile(id: number): Observable<ProfilePageModel[]> {
    const url = `${this.baseUrl}/PagesByIdProfile/${id}`;

    return this.http.get<ProfilePageModel[]>(url, {
      headers: this.getAuthHeaders()
    });
  }
}
