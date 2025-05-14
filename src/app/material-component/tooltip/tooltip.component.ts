import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MaterialModule } from 'src/app/material.module';


@Component({
  selector: 'app-tooltip',
  standalone: true,
  imports:[MaterialModule, FormsModule, MatButtonModule, MatTooltipModule, MatFormFieldModule, MatSelectModule, ReactiveFormsModule],
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss']
})
export class TooltipComponent {
  position: any = 'before';
}
