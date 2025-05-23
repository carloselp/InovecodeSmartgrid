import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [MaterialModule, FormsModule, ReactiveFormsModule, MatSliderModule],
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent {

  demo: number = 0;
  val = 50;
  min = 0;
  max = 100;

  constructor() { }
}
