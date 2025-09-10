import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {ApexChart, ApexDataLabels, ApexAxisChartSeries, ApexXAxis, ApexStroke, ApexTooltip, ApexTitleSubtitle} from 'ng-apexcharts';

@Component({
  standalone: false,
  selector: 'app-medicao-detalhe-dialog',
  templateUrl: './medicao-detalhe-dialog.component.html',
  styleUrls: ['./medicao-detalhe-dialog.component.scss']
})
export class MedicaoDetalheDialogComponent implements OnInit {
  lineChartOptions: {
    series?: ApexAxisChartSeries;
    chart?: ApexChart;
    xaxis?: ApexXAxis;
    stroke?: ApexStroke;
    dataLabels?: ApexDataLabels;
    tooltip?: ApexTooltip | any;
    title?: ApexTitleSubtitle;
  } = {};
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { nome: string; unidade: string; historico: any[] }
  ) {
    this.lineChartOptions = this.createAreaChart(data.historico, data.nome, data.unidade);
  }

  ngOnInit(): void {}

  private createAreaChart(data: any[], nome: string, unidade: string): any {
    return {
      series: [{
        name: `${nome} (${unidade})`,
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
        text: `Histórico de ${nome}`,
      },
      tooltip: {
        x: {
          format: 'dd/MM/yyyy HH:mm'
        },
        y: {
          formatter: (val: number) => `${val.toFixed(2)} ${unidade}`
        }
      }
    };
  }

}
