import {Component} from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports:[MaterialModule, MatTabsModule],
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent {

}
