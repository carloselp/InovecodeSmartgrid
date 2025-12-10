import {Component, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule, MAT_DIALOG_DATA, MatDialogRef, MatDialog} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {ToastrService} from 'ngx-toastr';
import {DialogService} from 'src/app/service/shared/dialog.service';
import {NgxSpinnerService} from 'ngx-spinner';
import * as L from 'leaflet';
import { AfterViewInit } from '@angular/core';

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'assets/marker-icon-2x.png',
  iconUrl: 'assets/marker-icon.png',
  shadowUrl: 'assets/marker-shadow.png'
});

export interface NotificationItem {
  type: 'Falha' | 'Baixa Geração' | 'Manutenção' | 'Sistema';
  title: string;
  source: string; // usina/equipamento
  priority: 'Alta' | 'Média' | 'Baixa';
  status: 'novo' | 'lido' | 'em_andamento';
  timestamp: Date;
  message: string;
  recommendation?: string;
  metrics?: {
    generation?: number;
    expected?: number;
    inverterId?: string;
    plant?: string;
  };
}

@Component({
  standalone: false,
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent implements AfterViewInit {

  ngAfterViewInit(): void {
    // Garante que o mapa redesenhe corretamente após a view estar pronta
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 200);
  }

  displayedColumns: string[] = ['type', 'title', 'source', 'priority', 'status', 'timestamp', 'action'];

  /** MOCK: eventos reais comuns no setor solar */
  notifications: NotificationItem[] = [
    {
      type: 'Falha',
      title: 'Falha de comunicação com inversor',
      source: 'Inversor #INV-07 · Usina Solarplant A',
      priority: 'Alta',
      status: 'novo',
      timestamp: new Date(new Date().setMinutes(new Date().getMinutes() - 6)),
      message: 'O inversor INV-07 parou de enviar telemetria há 6 minutos.',
      recommendation: 'Verifique conectividade (rede/RS485) e reinicie o inversor se necessário.',
      metrics: { inverterId: 'INV-07', plant: 'Solarplant A' }
    },
    {
      type: 'Baixa Geração',
      title: 'Geração abaixo do esperado',
      source: 'String 3 · Usina Solarplant B',
      priority: 'Média',
      status: 'em_andamento',
      timestamp: new Date(new Date().setHours(new Date().getHours() - 1)),
      message: 'Produção atual 22% menor que o previsto pelo irradiance model.',
      recommendation: 'Inspecione sombreamento e sujeira dos módulos; revisar MPPT.',
      metrics: { generation: 42.3, expected: 54.1, plant: 'Solarplant B' }
    },
    {
      type: 'Manutenção',
      title: 'Manutenção preventiva programada',
      source: 'Usina Solarplant C',
      priority: 'Baixa',
      status: 'lido',
      timestamp: new Date(new Date().setDate(new Date().getDate() - 1)),
      message: 'Checklist trimestral de manutenção amanhã às 08:00.',
      recommendation: 'Confirmar equipe e EPI. Bloquear agenda dos técnicos.',
      metrics: { plant: 'Solarplant C' }
    },
    {
      type: 'Sistema',
      title: 'Atualização de firmware disponível',
      source: 'Inversores Série X',
      priority: 'Baixa',
      status: 'novo',
      timestamp: new Date(new Date().setMinutes(new Date().getMinutes() - 35)),
      message: 'Firmware v2.3.1 disponível com correções de estabilidade.',
      recommendation: 'Aplicar atualização fora do horário de pico.',
      metrics: { }
    }
  ];

  dataSource = new MatTableDataSource<NotificationItem>(this.notifications);
  expandedElement: NotificationItem | null = null;
  filterValue = '';

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // filtro custom: busca em múltiplos campos
    this.dataSource.filterPredicate = (data: NotificationItem, filter: string) => {
      const v = (s: any) => (s ?? '').toString().toLowerCase();
      const blob = [
        data.type, data.title, data.source,
        data.priority, data.status,
        data.message, data.recommendation,
        data.metrics?.inverterId, data.metrics?.plant
      ].map(v).join(' ');
      return blob.includes(filter.trim().toLowerCase());
    };
  }

  applyFilter(ev: Event) {
    const value = (ev.target as HTMLInputElement).value;
    this.filterValue = value;
    this.dataSource.filter = value.trim().toLowerCase();
    if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
  }

  clearFilter() {
    this.filterValue = '';
    this.dataSource.filter = '';
  }

  toggleExpand(row: NotificationItem) {
    this.expandedElement = this.expandedElement === row ? null : row;
  }

  markAsRead(e: NotificationItem) {
    e.status = 'lido';
    // força refresh de tabela
    this.dataSource.data = [...this.dataSource.data];
  }

  acknowledge(e: NotificationItem) {
    this.markAsRead(e);
  }

  openRelated(e: NotificationItem) {
    // aqui você pode navegar para dashboards/relatórios relacionados
    console.log('Abrir dados relacionados:', e);
  }

  chipColor(type: NotificationItem['type']) {
    return {
      'chip-falha': type === 'Falha',
      'chip-baixa': type === 'Baixa Geração',
      'chip-manutencao': type === 'Manutenção',
      'chip-sistema': type === 'Sistema',
    };
  }

  //mapa

  usinaNome = 'SENAI IST';
  usinaLat = -3.8492973;
  usinaLng = -38.5990356;
  criticidade: 'Alta' | 'Média' | 'Baixa' = 'Alta';

  zoomLevel = 17;
  mapCenter = new L.LatLng(this.usinaLat, this.usinaLng);

  mapOptions: L.MapOptions = {
    layers: [
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
      })
    ],
    zoom: this.zoomLevel,
    center: this.mapCenter,
  };

  mapLayers: L.Layer[] = [
    L.marker(new L.LatLng(this.usinaLat, this.usinaLng), {
      icon: this.getCustomIcon(this.criticidade)
    }).bindPopup(`<b>${this.usinaNome}</b><br/>Criticidade: ${this.criticidade}`)
  ];

  getUnreadCount(): number {
    return this.notifications.filter(n => n.status !== 'lido').length;
  }

  getCustomIcon(nivel: string): L.DivIcon {
    let color = this.getCriticidadeColor(nivel);

    // Você pode usar um SVG embutido (Data URL) ou trocar por imagem custom
    return L.divIcon({
      html: `
      <div style="
        background-color: ${color};
        border-radius: 50%;
        width: 20px;
        height: 20px;
        border: 2px solid white;
        box-shadow: 0 0 6px rgba(0,0,0,0.4);
      " title="Usina: ${this.usinaNome}"></div>
    `,
      className: '',
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });
  }


  getCriticidadeColor(nivel: string): string {
    switch (nivel) {
      case 'Alta': return '#f44336'; // vermelho
      case 'Média': return '#ff9800'; // laranja
      case 'Baixa': return '#4caf50'; // verde
      default: return 'gray';
    }
  }

}
