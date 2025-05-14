import {Routes} from '@angular/router';
import {FullComponent} from './layouts/full/full.component';
import {LoginComponent} from './auth/login/login.component';
import {ConfigurationComponent} from './layouts/full/configuration/configuration.component';
import {MyProfileComponent} from './auth/my-profile/my-profile.component';
import {RedirectGuard} from "./guards/redirect.guard";
import {AuthGuard} from "./guards/auth.guard";

export const AppRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [RedirectGuard]
  },
  {
    path: '',
    component: FullComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('./material-component/material.module').then(m => m.MaterialComponentsModule)
      },
      {
        path: '',
        loadChildren: () => import('./administrator/administrator.module').then(m => m.AdministratorComponentsModule)
      },
      {
        path: '',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardComponentsModule)
      },
      {
        path: 'configuration',
        component: ConfigurationComponent
      },
      {
        path: 'profile-system',
        component: MyProfileComponent
      },
    ]
  }
];
