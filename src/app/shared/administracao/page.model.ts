import {DatePipe} from '@angular/common';

export class PageNewModel {
  constructor(
    public name_page: string,
    public route: string,
    public group_menu: string,
    public icon: string,
    public nav_item: string
  ) {}
}

export class PageModel {
  constructor(
    public id: number,
    public name_page: string,
    public route: string,
    public group_menu: string,
    public icon: string,
    public nav_item: string
  ) {}
}
