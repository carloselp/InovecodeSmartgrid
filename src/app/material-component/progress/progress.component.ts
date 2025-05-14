import { CommonModule, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSliderModule } from '@angular/material/slider';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [MaterialModule, FormsModule, ReactiveFormsModule, CommonModule, MatProgressBarModule, MatCardModule, MatRadioModule, NgIf, MatSliderModule, MatProgressBarModule],
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss']
})
export class ProgressComponent {
  color = 'primary';
  mode:any = 'determinate';
  value = 50;
  bufferValue = 75;

}
