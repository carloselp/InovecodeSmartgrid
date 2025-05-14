import { Injectable, OnInit } from '@angular/core';

@Injectable()
export class MenuItems{
  constructor() { }
  getMenuItems(): any[] {
    const menuData = localStorage.getItem('menu');

    if (menuData) {
      try {
        return JSON.parse(menuData);
      } catch (error) {
        return [];
      }
    } else {
      return [];
    }
  }

  transformResponse(data: any[]): any[] {
    const grouped = data.reduce((acc, curr) => {
      if (!acc[curr.Name]) {
        acc[curr.Name] = {
          state: '',
          name: curr.Name,
          type: 'expansive',
          icon: curr.Icon,
          expanded: false,
          submenu: []
        };
      }

      acc[curr.Name].submenu.push({
        state: curr.Type,
        name: curr.State,
        type: 'link',
        icon: 'arrow_right',
        expanded: false
      });

      return acc;
    }, {});
    return Object.values(grouped);
  }
}
