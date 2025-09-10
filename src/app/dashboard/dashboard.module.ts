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

import { NgxSpinnerModule } from 'ngx-spinner';
import { ModalModule } from 'ngx-bootstrap/modal';
import {MatDialogModule} from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { DashboardRoutes } from './dashboard.routing';
import {DashboardSolarplantComponent} from "./solarplant/solarplant.component";
import {NgApexchartsModule} from "ng-apexcharts";
import {SolarplantService} from "../service/administrator/solarplant.service";
import {DashboardSolarplantService} from "../service/dashboard/solarplant.service";
import {MatSelectModule} from "@angular/material/select";
import {MedicaoDetalheDialogComponent} from "./medicao-detalhe-dialog/medicao-detalhe-dialog.component";


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(DashboardRoutes),
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
    MatCheckboxModule,
    NgApexchartsModule,
    MatSelectModule
  ],
  providers: [
    DashboardSolarplantService,
  ],
  declarations: [
    DashboardSolarplantComponent,
    MedicaoDetalheDialogComponent
  ],
})
export class DashboardComponentsModule {}
