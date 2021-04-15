import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-coin',
  templateUrl: './coin.component.html',
  styleUrls: ['./coin.component.css']
})
export class CoinComponent implements OnInit {
  options: any;
  coinId: string;
  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit(): void {

    this.coinId = this.route.snapshot.params.id;
    console.log(this.coinId);

    this.http.get('http://localhost:3000/coin/' + this.coinId).subscribe((r: any) => {
      const xAxisData = [];
      const data1 = [];
      const data2 = [];

      for (const element of r) {
        xAxisData.push(element.timestamp);
        data1.push(element.youtubeIndex);
        data2.push(element.price);
      }

      this.options = {
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
            name: 'yt',
            type: 'line',
            data: data1,
            animationDelay: (idx) => idx * 10,
          },
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
