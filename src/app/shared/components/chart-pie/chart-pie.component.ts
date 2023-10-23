import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { IChartBasicConfig } from '../../models/charts.interface';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { TYPE_CHARTS } from '../../constants/values.constants';

const typeChart = TYPE_CHARTS.CHART_PIE;

@Component({
  selector: 'app-chart-pie',
  templateUrl: './chart-pie.component.html',
  styleUrls: ['./chart-pie.component.scss'],
})
export class ChartPieComponent implements OnInit {
  
  pieChartData: ChartData<'pie', number[], string | string[]> = null;
  public pieChartOptions: ChartConfiguration['options'] = null;
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  @Input() set chartBasicConfig (data: IChartBasicConfig) {
    if(data){
      this.pieChartData = this.buildPieChartData(data);
      this.pieChartOptions =  this.buildPieChartOptions(data);      
    }
  };

  @Output() itemSelected: EventEmitter<any> = new EventEmitter();


  constructor() { }

  ngOnInit() {}

  public pieChartType: ChartType = 'pie';
  public pieChartPlugins = [ DatalabelsPlugin ];
  
  /**
   * Build pieChartData for PIE chart
   */

  buildPieChartData( data: IChartBasicConfig) {
    return  {
      labels: data.labels,
      datasets: [ { 
        data: data.values,
      }],
    }
  }

  buildPieChartOptions( data: IChartBasicConfig): ChartConfiguration['options'] {
    let resultSum = this.calculateSumTotal(data.values);
    return {
      responsive: true,
      onClick : (evt, item: Array<any>) => {
        if(item && item.length>0){
          this.emitItemSelected(item[0]);
        }
      },
      plugins: {
        title: {
          display: (data.titleChart != undefined && data.titleChart != null ? true : false),
          text: (data.titleChart != undefined && data.titleChart != null ? data.titleChart : ''),
          position: "top",
          align: 'center',
          color: '#06192b',
          font: {
            size: 13
          }
        },
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            color: '#06192b'
          }
        },
        datalabels: {
          color: '#06192b',
          formatter: (value) => {
            return `${Math.round ((value*100)/resultSum)}%`;
          },
        },
      }
    };
  }

  emitItemSelected (data) {
    this.itemSelected.emit(
      {
        indexSelected: data.index,
        typeChart: typeChart
      }
    )
  }

  calculateSumTotal(values: Array<number>) {
    return values.reduce((a, b) => a + b, 0);
  }

}
