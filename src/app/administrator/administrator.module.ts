import 'hammerjs';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import {MatAutocompleteModule} from '@angular/material/autocomplete';

import { AdministratorRoutes } from './administrator.routing';
import { ProfileComponent } from './profile/profile.component';
import { UserComponent } from './user/user.component';
import { PageComponent } from './page/page.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ModalModule } from 'ngx-bootstrap/modal';
import {MatDialogModule} from '@angular/material/dialog';
import { PermitionUserComponent } from './user/permition-user/permition-user.component';
import { ProfileService } from '../service/administrator/profile.service';
import { ProfilePageService } from '../service/administrator/profilepage.service';
import { ProfileUserService } from '../service/administrator/profileUser.service';
import { PageUserService } from '../service/administrator/pageuser.service';
import { UserService } from '../service/administrator/user.service';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MaterialModule } from '../material.module';
import {SolarplantComponent} from "./solarplant/solarplant.component";
import {SolarplantService} from "../service/administrator/solarplant.service";
import {SolarinverterService} from "../service/administrator/solarinverter.service";
import {SolarinverterComponent} from "./solarplant/solarinverter/solarinverter.component";


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdministratorRoutes),
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    ModalModule,
    MatDialogModule,
    NgxSpinnerModule,
    MatInputModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatCardModule,
    MatIconModule,
    MatPaginatorModule,
    MatCheckboxModule
  ],
  providers: [
    UserService,
    ProfileService,
    ProfilePageService,
    ProfileUserService,
    PageUserService,
    SolarplantService,
    SolarinverterService
  ],
  declarations: [
    ProfileComponent,
    UserComponent,
    PageComponent,
    PermitionUserComponent,
    SolarplantComponent,
    SolarinverterComponent
  ],
})
export class AdministratorComponentsModule {}
