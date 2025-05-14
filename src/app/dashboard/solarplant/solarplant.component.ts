import {Component, OnInit, ViewChild} from '@angular/core';
import {NgxSpinnerService} from "ngx-spinner";
import {ApexOptions, ChartComponent} from "ng-apexcharts";
import {MatTableDataSource} from "@angular/material/table";
import {DashboardSolaplantModel} from "../../shared/dashboard/solarplant.model";
import {DashboardSolarplantService} from "../../service/dashboard/solarplant.service";
import {MatPaginator} from "@angular/material/paginator";
import { MatCardModule } from '@angular/material/card';

@Component({
  standalone: false,
  selector: 'app-solarplant',
  templateUrl: './solarplant.component.html',
  styleUrl: './solarplant.component.scss'
})
export class DashboardSolarplantComponent implements OnInit {
  dataSource = new MatTableDataSource();
  dataSourceFilter = new MatTableDataSource(this.dataSource.data);

  @ViewChild('chart') chart!: ChartComponent;
  @ViewChild('barchart') barchart!: ChartComponent;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit() {

  }

  constructor(
    private dashboardService: DashboardSolarplantService,
    private spinner: NgxSpinnerService
  ){

  }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.spinner.show();
    this.dashboardService.get().subscribe((data: DashboardSolaplantModel[]) => {
      this.dataSource.data = data;
      this.dataSourceFilter.data = this.dataSource.data;

      // 1. Extrair apenas a hora (HH:mm) do createdAt
      const categories: string[] = [
        ...new Set(
          this.dataSourceFilter.data.map((item: any) =>
            new Date(item.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
          )
        )
      ].sort((a, b) => {
        const dateA = new Date(`1970-01-01T${a}:00`);
        const dateB = new Date(`1970-01-01T${b}:00`);
        return dateA.getTime() - dateB.getTime();
      });

      // 2. Obter todas as origens (usinas solares)
      const origins: string[] = [...new Set(this.dataSourceFilter.data.map((item: any) => item.solarplant))];

      // 3. Construir os dados para o gráfico: valores ao longo do tempo
      const series = origins.map(origin => ({
        name: origin,
        data: categories.map(time => {
          const found = this.dataSourceFilter.data.find((item: any) =>
            item.solarplant === origin &&
            new Date(item.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) === time
          ) as any;
          return found?.value ?? 0;
        })
      }));

      // 4. Configurar o gráfico
      this.lineChartOptions = {
        chart: {
          type: 'line',
          height: 350
        },
        series: series,
        xaxis: {
          categories: categories,
          title: {
            text: 'Horário'
          }
        },
        stroke: {
          curve: 'smooth'
        },
        dataLabels: {
          enabled: false
        },
        title: {
          text: 'Geração Teórica por Usina ao Longo do Tempo',
          align: 'center'
        },
        tooltip: {
          enabled: true,
          theme: 'dark'
        }
      };

      this.spinner.hide();
    });
  }


  filters = {
    openingDate: null,
    closingDate: null
  };

  filterData() {
    this.dataSourceFilter.data = this.dataSource.data.filter((os: any) => {
      return (
        (!this.filters.openingDate || new Date(os.openingDate).toISOString().split('T')[0] === new Date(this.filters.openingDate).toISOString().split('T')[0]) &&
        (!this.filters.closingDate || new Date(os.closingDate).toISOString().split('T')[0] === new Date(this.filters.closingDate).toISOString().split('T')[0])
      );
    });

    const categories: string[] = [...new Set(this.dataSourceFilter?.data.map((item: any) => item.openingDate))]
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    const origins: string[] = [...new Set(this.dataSourceFilter?.data.map((item: any) => item.origin))];

    const series = origins.map(origin => ({
      name: origin,
      data: categories.map(date =>
        this.dataSourceFilter?.data.filter((item: any) => item.origin === origin && item.openingDate === date).length || 0
      )
    }));

    this.lineChartOptions = {
      chart: {
        type: 'line',
        height: 350
      },
      series: series,
      xaxis: {
        categories: categories,
        title: {
          text: 'Datas de Abertura'
        }
      },
      stroke: {
        curve: 'smooth'
      },
      dataLabels: {
        enabled: false
      },
      title: {
        text: 'Ordens de Serviço por Origem ao Longo do Tempo',
        align: 'center'
      },
      tooltip: {
        enabled: true,
        theme: 'dark'
      }
    };

  }

  cleanStartData(){
    this.filters.openingDate = null;
    this.filterData();
  }

  public lineChartOptions: ApexOptions = {
    chart: {
      type: 'line',
      height: 350
    },
    series: [],
    xaxis: {
      categories: [],
      title: {
        text: 'Datas de Abertura'
      }
    },
    stroke: {
      curve: 'smooth'
    },
    dataLabels: {
      enabled: false
    },
    title: {
      text: 'Ordens de Serviço por Origem ao Longo do Tempo',
      align: 'center'
    },
    tooltip: {
      enabled: true,
      theme: 'dark'
    }
  };
}
