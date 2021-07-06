import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-btc',
  templateUrl: './btc.component.html',
  styleUrls: ['./btc.component.css']
})
export class BTCComponent implements OnInit {
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
    const data3 = [];
    const data4 = [];
    const data5 = [];
    for (const element of r) {
      xAxisData.push(this.dateToYMD(new Date(element.timestamp)));
      data1.push(element.balances.bigWhales);
      data2.push(element.balances.whales);
      data3.push(element.balances.dolpins);
      data4.push(element.balances.others);
      data5.push(element.price);
    }

    this.optionsIndice = {
      legend: {
        display: true
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

      series: [
        {
          name: 'Big Whales',
          type: 'line',
          data: data1,
          animationDelay: (idx) => idx * 10,
        },
        {
          name: 'Whales',
          type: 'line',
          data: data2,
          animationDelay: (idx) => idx * 10,
        },
        {
          name: 'Dolphins',
          type: 'line',
          data: data3,
          animationDelay: (idx) => idx * 10,
        },
        {
          name: 'Others',
          type: 'line',
          data: data4,
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
      series: [

        {
          name: 'price',
          type: 'line',
          data: data5,
          animationDelay: (idx) => idx * 10 + 100,
        },
      ],
      animationEasing: 'elasticOut',
      animationDelayUpdate: (idx) => idx * 5,
    };

  }

  ngOnInit(): void {

    this.http.get(environment.backend_url + '/btc').subscribe((r: any) => {
      this.data = r;
      this.drawn();
    });
  }

}
