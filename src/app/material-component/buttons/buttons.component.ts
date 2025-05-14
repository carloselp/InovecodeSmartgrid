import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-buttons',
  standalone: true,
  imports: [MaterialModule, MatButtonModule],
  templateUrl: './buttons.component.html',
  styleUrls: ['./buttons.component.scss']
})
export class ButtonsComponent {
  constructor() { }
}
