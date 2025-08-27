import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms'
import {SolarplantService} from "../../service/administrator/solarplant.service";
import { ApexChart, ApexNonAxisChartSeries, ApexPlotOptions, ApexDataLabels, ApexAxisChartSeries, ApexXAxis, ApexStroke, ApexTooltip, ApexTitleSubtitle } from 'ng-apexcharts';
import {SolarplantModel} from "../../shared/administracao/solarplant.model";
import {MatTableDataSource} from "@angular/material/table";
import {DashboardSolarplantService} from "../../service/dashboard/solarplant.service";
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from "ngx-spinner";
import {forkJoin} from "rxjs";

@Component({
  standalone: false,
  selector: 'app-solarplant',
  templateUrl: './solarplant.component.html',
  styleUrls: ['./solarplant.component.scss'],
  providers: [
    SolarplantService
  ]
})
export class DashboardSolarplantComponent implements OnInit {

  filtroForm!: FormGroup;
  maxDate = new Date();
  solarplants: SolarplantModel[] = [];

  radialCharts: any[] = [];
  lineChartOptions: {
    series?: ApexAxisChartSeries;
    chart?: ApexChart;
    xaxis?: ApexXAxis;
    stroke?: ApexStroke;
    dataLabels?: ApexDataLabels;
    tooltip?: ApexTooltip;
    title?: ApexTitleSubtitle;
  } = {};

  constructor(
    private fb: FormBuilder,
    private solarplantService: SolarplantService,
    private dashboardService: DashboardSolarplantService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.filtroForm = this.fb.group({
      data: [new Date()],
      usina: [null]
    });

    this.carregarUsinas();
  }

  carregarUsinas(): void {
    this.solarplantService.getAll().subscribe(response => {
      this.solarplants = response;

      if (this.solarplants.length > 0) {
        this.filtroForm.patchValue({ usina: this.solarplants[0].id });
        this.getData();
      } else {
        this.toastr.warning('Nenhuma usina encontrada.');
      }
    });
  }


  getData(): void {
    const form = this.filtroForm.value;
    const id = form.usina;
    const date = this.formatDate(form.data);

    if (!id || !date) return;

    this.spinner.show();

    forkJoin({
      medicoes: this.dashboardService.getMedicao(id, date),
      geracoes: this.dashboardService.getGeracao(id, date)
    }).subscribe({
      next: ({ medicoes, geracoes }) => {
        this.radialCharts = medicoes.map(medicao => this.createRadialChart(medicao));
        this.lineChartOptions = this.createAreaChart(geracoes);
        this.spinner.hide();
      },
      error: (err) => {
        this.spinner.hide();
        this.toastr.error('Erro ao carregar os dados do dashboard.');
      }
    });
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private createRadialChart(medicao: { name: string; value: number }) {
    const unidade = this.getUnidadeDeMedida(medicao.name);

    return {
      title: medicao.name,
      chart: {
        type: 'radialBar',
        offsetY: -20,
        height: 300,
        sparkline: {
          enabled: true
        }
      } as ApexChart,
      series: [medicao.value],
      labels: [medicao.name],
      plotOptions: {
        radialBar: {
          startAngle: -90,
          endAngle: 90,
          track: {
            background: "#e7e7e7",
            strokeWidth: '97%',
            margin: 5,
            dropShadow: {
              enabled: true,
              top: 2,
              left: 0,
              color: '#444',
              opacity: 1,
              blur: 2
            }
          },
          dataLabels: {
            name: {
              show: false
            },
            value: {
              offsetY: -2,
              fontSize: '22px',
              color: '#111',
              formatter: (val: number) => `${val.toFixed(1)} ${unidade}`
            }
          }
        }
      },
      grid: {
        padding: {
          top: -10
        }
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          shadeIntensity: 0.4,
          inverseColors: false,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 50, 53, 91]
        }
      }
    };
  }

  private createAreaChart(data: any[]): any {
    return {
      series: [{
        name: 'Produção',
        data: data.map(item => ({
          x: new Date(item.createdAt),
          y: item.value
        }))
      }],
      chart: {
        type: 'area',
        height: 350
      },
      xaxis: {
        type: 'datetime'
      },
      stroke: {
        curve: 'smooth'
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.4,
          opacityTo: 0.1,
          stops: [0, 90, 100]
        }
      },
      dataLabels: {
        enabled: false
      },
      title: {
        text: 'Produção'
      },
      tooltip: {
        x: {
          format: 'dd/MM/yyyy HH:mm'
        },
        y: {
          formatter: (value: number) => `${value} kW`
        }
      }
    };
  }
  private getUnidadeDeMedida(nome: string): string {
    if (nome.includes('Corrente')) return 'A';
    if (nome.includes('Irradiação')) return 'W/m²';
    if (nome.includes('Temperatura')) return '°C';
    if (nome.includes('Tensão')) return 'V';
    if (nome.includes('Umidade')) return '%';
    if (nome.includes('Vento')) return 'm/s';
    return '';
  }

}
