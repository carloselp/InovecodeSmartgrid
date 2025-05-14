import { DatePipe } from '@angular/common';

export class ProfileNewModel {
  constructor(
    public profile_name: string,
  ){}
}

export class ProfileModel {
  constructor(
    public id: number,
    public profile_name: string,
    public countPages: number
  ){}
}
