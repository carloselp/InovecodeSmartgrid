import { DatePipe } from '@angular/common';

export class UserNewModel {
  constructor(
    public user_login: string,
    public access_key: string,
    public last_name: string,
    public first_name: string,
    public email: string,
    public contact: string,
    public status: number
  ){}
}

export class UserModel {
  constructor(
    public id: number,
    public user_login: string,
    public access_key: string,
    public last_name: string,
    public first_name: string,
    public email: string,
    public contact: string,
    public status: number
  ){}
}
