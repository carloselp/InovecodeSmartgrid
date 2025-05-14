import {NgModule} from '@angular/core';
import {NgxTimeSchedulerComponent} from './ngx-time-scheduler.component';
import {CommonModule, DatePipe, JsonPipe, NgIf} from '@angular/common';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatMenuModule} from '@angular/material/menu';
import { TravelsListComponent } from 'src/app/scheduler/events-list/events-list.component';
import { MatListModule } from '@angular/material/list';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from 'ngx-spinner';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';
import { DriverService } from 'src/app/service/travel/driver.service';

@NgModule({
  declarations: [
    NgxTimeSchedulerComponent,
    TravelsListComponent
  ],
  imports: [
    CommonModule,
    DragDropModule,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    JsonPipe,
    MatNativeDateModule,
    MatButtonModule,
    MatFormFieldModule, 
    MatInputModule, 
    MatDatepickerModule, 
    MatNativeDateModule,
    MatCardModule,
    MatIconModule,
    MatSelectModule,
    MatTooltipModule,
    MatToolbarModule,
    MatBottomSheetModule,
    MatMenuModule,
    MatListModule,
    MatAutocompleteModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    MatCheckboxModule,
    MatRadioModule
  ],
  exports: [NgxTimeSchedulerComponent],
  providers: [
    DatePipe,
    DriverService
  ]
})
export class NgxTimeSchedulerModule {
}
