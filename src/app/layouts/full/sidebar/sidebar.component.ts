import {ChangeDetectorRef, Component, OnDestroy} from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import {MenuItems} from '../../../shared/menu-items/menu-items';
import {CommonModule, NgFor, NgIf} from '@angular/common';
import {RouterModule} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {MaterialModule} from 'src/app/material.module';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {ReactiveFormsModule} from '@angular/forms';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [MaterialModule, NgFor, NgIf, RouterModule, CommonModule, FormsModule, MatIconModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class AppSidebarComponent implements OnDestroy {
  MENUITEMS: any[] = [];
  filteredItems: any[] = []; // Lista filtrada para busca
  private _mobileQueryListener: () => void;
  mobileQuery: MediaQueryList;
  searchTerm: string = '';

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher,
    private menuService: MenuItems // Injetando o serviço aqui
  ) {
    this.mobileQuery = this.media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => this.changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    const menuData = this.menuService.getMenuItems();
    this.MENUITEMS = this.menuService.transformResponse(menuData);
    this.filteredItems = [...this.MENUITEMS]; // Inicializa com todos os itens
  }

  getRouterLink(path: string): string[] {
    return ['/', ...path.split('/')];
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  toggleItem(item: any) {
    item.expanded = !item.expanded;
  }

  onSearch() {
    // Filtra os itens do menu conforme o termo de busca
    this.filteredItems = this.MENUITEMS.filter(item =>
      item.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.submenu.some((subitem: any) => subitem.name.toLowerCase().includes(this.searchTerm.toLowerCase()))
    );
  }
}
