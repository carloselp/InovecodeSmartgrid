import { Routes } from '@angular/router';
import { PageComponent } from './page/page.component';
import { ProfileComponent } from './profile/profile.component';
import { UserComponent } from './user/user.component';
import { PermitionUserComponent } from './user/permition-user/permition-user.component';
import {SolarplantComponent} from "./solarplant/solarplant.component";
import {SolarinverterComponent} from "./solarplant/solarinverter/solarinverter.component";

export const AdministratorRoutes: Routes = [
  {
    path: 'user',
    component: UserComponent
  },
  {
    path: 'page',
    component: PageComponent
  },
  {
    path: 'profile',
    component: ProfileComponent
  },
  {
    path: 'user/permition/:id',
    component: PermitionUserComponent
  },
  {
    path: 'solarplant',
    component: SolarplantComponent
  },
  {
    path: 'solarplant/:id/solarinverter',
    component: SolarinverterComponent
  }
];
