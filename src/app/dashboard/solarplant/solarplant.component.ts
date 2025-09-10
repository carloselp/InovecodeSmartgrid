import {Component, OnInit, OnDestroy} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms'
import {SolarplantService} from "../../service/administrator/solarplant.service";
import {ApexChart, ApexDataLabels, ApexAxisChartSeries, ApexXAxis, ApexStroke, ApexTooltip, ApexTitleSubtitle} from 'ng-apexcharts';
import {SolarplantModel} from "../../shared/administracao/solarplant.model";
import {DashboardSolarplantService} from "../../service/dashboard/solarplant.service";
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from "ngx-spinner";
import {forkJoin} from "rxjs";
import {DashboardSolaplantGeracaoXOutraMedidaModel} from "../../shared/dashboard/solarplant.model";
import {MatDialog} from "@angular/material/dialog";
import {MedicaoDetalheDialogComponent} from "../medicao-detalhe-dialog/medicao-detalhe-dialog.component";

@Component({
  standalone: false,
  selector: 'app-solarplant',
  templateUrl: './solarplant.component.html',
  styleUrls: ['./solarplant.component.scss'],
  providers: [
    SolarplantService
  ]
})
export class DashboardSolarplantComponent implements OnInit, OnDestroy {

  filtroForm!: FormGroup;
  maxDate = new Date();
  solarplants: SolarplantModel[] = [];
  dualLineCharts: any[] = [];
  intervalId: any;
  ultimaAtualizacao: Date | null = null;

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
    private spinner: NgxSpinnerService,
    private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.filtroForm = this.fb.group({
      data: [new Date()],
      usina: [null]
    });

    this.carregarUsinas();

    this.intervalId = setInterval(() => {
      this.getData();
    }, 300000); // 5 minutos
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  carregarUsinas(): void {
    this.spinner.show();

    this.solarplantService.getAll().subscribe(response => {
      this.solarplants = response;

      if (this.solarplants.length > 0) {
        this.filtroForm.patchValue({usina: this.solarplants[0].id});
        //this.getData();
      } else {
        this.toastr.warning('Nenhuma usina encontrada.');
      }

      this.spinner.hide();
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
      geracoes: this.dashboardService.getGeracao(id, date),
      geracaoXCorrente: this.dashboardService.getGeracaoXOutraMedida(id, date, 2),
      geracoesXTensao: this.dashboardService.getGeracaoXOutraMedida(id, date, 3),
      geracoesXTemperaturaAmbiente: this.dashboardService.getGeracaoXOutraMedida(id, date, 5),
    }).subscribe({
      next: ({medicoes, geracoes, geracaoXCorrente, geracoesXTensao, geracoesXTemperaturaAmbiente}) => {
        this.radialCharts = medicoes.map(medicao => this.createRadialChart(medicao));
        this.lineChartOptions = this.createAreaChart(geracoes);
        this.dualLineCharts = [
          this.createDualAxisChart(geracaoXCorrente, 'Geração x Corrente', 'A'),
          this.createDualAxisChart(geracoesXTensao, 'Geração x Tensão', 'V'),
          this.createDualAxisChart(geracoesXTemperaturaAmbiente, 'Geração x Temperatura Ambiente', '°C'),
        ];
        this.ultimaAtualizacao = new Date();
        this.spinner.hide();
      },
      error: (err) => {
        this.spinner.hide();
        this.toastr.error('Erro ao carregar os dados do dashboard.');
        console.error('Erro no forkJoin:', err);
      }
    });
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  abrirDetalhesMedicao(nome: string): void {
    const unidade = this.getUnidadeDeMedida(nome);
    const historico$ = this.dashboardService.getHistoricoMedicao(this.filtroForm.value.usina, this.formatDate(this.filtroForm.value.data), this.getCodigoUnidadeDeMedida(nome));

    this.spinner.show();

    historico$.subscribe({
      next: (historico) => {
        this.spinner.hide();
        this.dialog.open(MedicaoDetalheDialogComponent, {
          width: '800px',
          data: {
            nome,
            unidade,
            historico
          }
        });
      },
      error: () => {
        this.spinner.hide();
        this.toastr.error('Erro ao carregar histórico da medição.');
      }
    });
  }

  private createDualAxisChart(
    data: DashboardSolaplantGeracaoXOutraMedidaModel[],
    titulo: string,
    unidade: string
  ): any {
    return {
      title: titulo,
      series: [
        {
          name: 'Geração (kW)',
          type: 'line',
          data: data.map(item => ({
            x: new Date(item.createdAt),
            y: item.geracao
          }))
        },
        {
          name: `Medição (${unidade})`,
          type: 'line',
          data: data.map(item => ({
            x: new Date(item.createdAt),
            y: item.value
          }))
        }
      ],
      chart: {
        type: 'line',
        height: 350,
        stacked: false
      },
      xaxis: {
        type: 'datetime',
        labels: {
          datetimeUTC: false
        }
      },
      yaxis: [
        {
          title: {
            text: 'Geração (kW)'
          },
          labels: {
            formatter: (val: number) => `${val.toFixed(1)} kW`
          }
        },
        {
          opposite: true,
          title: {
            text: `Medição (${unidade})`
          },
          labels: {
            formatter: (val: number) => `${val.toFixed(1)} ${unidade}`
          }
        }
      ],
      stroke: {
        width: [2, 2],
        curve: 'smooth'
      },
      tooltip: {
        shared: true,
        x: {
          format: 'dd/MM/yyyy HH:mm'
        }
      },
      dataLabels: {
        enabled: false
      }
    };
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
        type: 'datetime',
        labels: {
          datetimeUTC: false
        }
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

  private getCodigoUnidadeDeMedida(nome: string): number {
    if (nome.includes('Corrente')) return 2;
    if (nome.includes('Irradiação')) return 6;
    if (nome.includes('Placa')) return 4;
    if (nome.includes('Ambiente')) return 5;
    if (nome.includes('Tensão')) return 3;
    if (nome.includes('Umidade')) return 8;
    if (nome.includes('Vento')) return 7;
    return 0;
  }

}
