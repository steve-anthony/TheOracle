import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-safemoon',
  templateUrl: './safemoon.component.html',
  styleUrls: ['./safemoon.component.css']
})
export class SafemoonComponent implements OnInit {
  optionsIndice: any;
  optionsPrice: any;
  coinId: string;
  isLog = false;
  data: any;

  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  dateToYMD(date): string {
    const d = date.getDate();
    const m = date.getMonth() + 1; // Month from 0 to 11
    const y = date.getFullYear();
    return '' + y + '-' + (m <= 9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
  }

  onLog(): void {
    this.isLog = !this.isLog;

    this.drawn();
  }

  drawn(): void {

    const r = this.data;

    const chartType = this.isLog ? 'log' : null;
    this.optionsIndice = {};
    this.optionsPrice = {};

    const xAxisData = [];
    const data1 = [];
    const data2 = [];

    for (const element of r) {
      xAxisData.push(this.dateToYMD(new Date(element.timestamp)));
      data1.push(element.burnP);
      data2.push(element.price);
    }

    this.optionsIndice = {
      legend: {
        data: ['indice'],
        align: 'left',
      },
      tooltip: {},
      xAxis: {
        data: xAxisData,
        silent: false,
        splitLine: {
          show: false,
        },
      },
      yAxis: {
        type: chartType
      },
      dataZoom: [
        {
          show: true,
          filterMode: 'empty',
        },
        {
          show: true,
          yAxisIndex: 0,
          filterMode: 'empty',
          width: 30,
          height: '80%',
          showDataShadow: false,
          left: '93%'
        }
      ],
      series: [
        {
          name: 'yt',
          type: 'line',
          data: data1,
          animationDelay: (idx) => idx * 10,
        }
      ],
      animationEasing: 'elasticOut',
      animationDelayUpdate: (idx) => idx * 5,
    };

    this.optionsPrice = {
      legend: {
        data: ['bar', 'bar2'],
        align: 'left',
      },
      tooltip: {},
      xAxis: {
        data: xAxisData,
        silent: false,
        splitLine: {
          show: false,
        },
      },
      yAxis: {
        type: chartType
      },

      dataZoom: [
        {
          show: true,
          filterMode: 'empty',
        },
        {
          show: true,
          yAxisIndex: 0,
          filterMode: 'empty',
          width: 30,
          height: '80%',
          showDataShadow: false,
          left: '93%'
        }
      ],
      series: [

        {
          name: 'price',
          type: 'line',
          data: data2,
          animationDelay: (idx) => idx * 10 + 100,
        },
      ],
      animationEasing: 'elasticOut',
      animationDelayUpdate: (idx) => idx * 5,
    };

  }

  ngOnInit(): void {

    this.http.get(environment.backend_url + '/safemoon').subscribe((r: any) => {
      this.data = r;
      this.drawn();
    });
  }

}
