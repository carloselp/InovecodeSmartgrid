import { Injectable } from '@angular/core'
import { HttpClient} from '@angular/common/http';
import { AppConstants } from 'src/app/AppConstants';
import {CrudService} from "../core/crud.service";
import {PageUserModel, PageUserNewModel} from "../../shared/administracao/pageuser.model";
import {Observable} from "rxjs";

@Injectable()
export class PageUserService extends CrudService<PageUserNewModel> {
  constructor(http: HttpClient) {
    super(http, AppConstants.baseSystemPageUsers);
  }

  public getPagesByIdUser(id: number): Observable<PageUserModel[]> {
    const url = `${this.baseUrl}/PagesByIdUser/${id}`;

    return this.http.get<PageUserModel[]>(url, {
      headers: this.getAuthHeaders()
    });
  }
}
