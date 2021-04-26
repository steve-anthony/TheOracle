import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-coin',
  templateUrl: './coin.component.html',
  styleUrls: ['./coin.component.css']
})
export class CoinComponent implements OnInit {
  optionsIndice: any;
  optionsPrice: any;
  coinId: string;
  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  dateToYMD(date): string {
    const d = date.getDate();
    const m = date.getMonth() + 1; // Month from 0 to 11
    const y = date.getFullYear();
    return '' + y + '-' + (m <= 9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
  }

  ngOnInit(): void {

    this.coinId = this.route.snapshot.params.id;
    console.log(this.coinId);

    this.http.get(environment.backend_url + '/coin/' + this.coinId).subscribe((r: any) => {
      const xAxisData = [];
      const data1 = [];
      const data2 = [];

      for (const element of r) {
        xAxisData.push(this.dateToYMD(new Date(element.timestamp)));
        data1.push(element.youtubeIndex);
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
        yAxis: {},
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
        yAxis: {},
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
    });

  }

}
