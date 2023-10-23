import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { IChartBasicConfig } from '../../models/charts.interface';
import { TYPE_CHARTS } from '../../constants/values.constants';

const typeChart = TYPE_CHARTS.CHART_BAR;

@Component({
  selector: 'app-chart-bars',
  templateUrl: './chart-bars.component.html',
  styleUrls: ['./chart-bars.component.scss'],
})
export class ChartBarsComponent implements OnInit {
  public barChartData: ChartData<'bar'> = null;
  public barChartOptions: ChartConfiguration['options'] | Object = null;

  @Input() set chartBasicConfig(data: IChartBasicConfig) {
    if (data) {
      this.barChartData = this.buildBarChartData(data);
      this.barChartOptions = this.buildBarChartOptions(data);
    }
  }

  @Output() itemSelected: EventEmitter<any> = new EventEmitter();
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  constructor() { }

  ngOnInit() { }

  public barChartType: ChartType = 'bar';
  public barChartPlugins = [DataLabelsPlugin];

  buildBarChartData(data: IChartBasicConfig) {
    const color = this.backgroundColorGenerated(data.values.length); 

    return {
      labels: data.labels,
      // datasets: data.values.map(((itemValue, index) => ({ data: [itemValue], label: data.lablesSerieBARS[index] })))
      datasets: [
        {
          data: data.values,
          label: data.lablesSerieBARS[0],
          backgroundColor: color.backgroundColor,
          borderColor: color.borderColor,
          borderWith: 1
        }
      ]
    };
  }

  buildBarChartOptions(data: IChartBasicConfig) {
    return {
      responsive: true,
      onClick: (evt, item: Array<any>) => {
        if (item && item.length > 0) {
          this.emitItemSelected(item[0]);
        }
      },
      scales: {
        x: {},
        y: {
          min: 0,
        },
      },
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            color: '#06192b'
          }
        }
      },
      indexAxis: (data.position != null ? data.position : 'x')
    };
  }

  emitItemSelected(data) {
    this.itemSelected.emit(
      {
        indexSelected: data.datasetIndex,
        typeChart: typeChart
      }
    )
  }

  public backgroundColorGenerated(lengthData) {
    const backgroundColor: Array<string> = []; 
    const borderColor: Array<string> = []; 
    const pointBackgroundColor: Array<string> = []; 
    const pointBorderColor: Array<string> = []; 

    for (let index = 0; index < lengthData; index++) {
      const r = Math.floor(Math.random() * 255);
      const g = Math.floor(Math.random() * 255);
      const b = Math.floor(Math.random() * 255);
      backgroundColor.push(`rgba(${r},${g},${b},0.2)`);
      borderColor.push(`rgba(${r},${g},${b},1)`);
      pointBackgroundColor.push(`rgba(${r},${g},${b},0.2)`);
      pointBorderColor.push('#fff');
    }

    return {
      backgroundColor,
      borderColor
    };
  }

  chartHovered(event: any) {

  }

  chartClicked(event: any) {

  }
}
