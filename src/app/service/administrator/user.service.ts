import { Injectable } from '@angular/core'
import { HttpClient} from '@angular/common/http';
import { AppConstants } from '../../AppConstants';
import { UserModel } from 'src/app/shared/administracao/user.model';
import {CrudService} from "../core/crud.service";

@Injectable()

export class UserService extends CrudService<UserModel> {
  constructor(http: HttpClient) {
    super(http, AppConstants.baseUser);
  }
}
