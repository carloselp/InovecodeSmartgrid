import { Component } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MaterialModule } from 'src/app/material.module';
@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [MaterialModule, MatMenuModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent { }
