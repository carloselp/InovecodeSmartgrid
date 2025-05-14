import { Injectable } from '@angular/core'
import { HttpClient, HttpRequest, HttpHeaders} from '@angular/common/http';
import { AppConstants } from 'src/app/AppConstants';
import {CrudService} from "../core/crud.service";
import {PageModel} from "../../shared/administracao/page.model";


@Injectable()

export class PageService extends CrudService<PageModel> {
  constructor(http: HttpClient) {
    super(http, AppConstants.baseSystemPages);
  }
}
