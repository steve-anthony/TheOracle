import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { EChartsOption } from 'echarts';
import { MatDatepicker } from '@angular/material/datepicker';
import { FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-safemoon-compute',
  templateUrl: './safemoon-compute.component.html',
  styleUrls: ['./safemoon-compute.component.css']
})
export class SafemoonComputeComponent implements OnInit {
  optionsIndice: any;
  optionsPrice: any;
  coinId: string;
  isLog = false;
  data: any;
  myBalance = 0;
  myDate: Date;

  form: FormGroup;

  @ViewChild(MatDatepicker) picker: MatDatepicker<Date>;
  @ViewChild(MatDatepicker) pickerTo: MatDatepicker<Date>;

  myProjection = [];

  constructor(private route: ActivatedRoute, private http: HttpClient) {

    const d = new Date();
    d.setDate(d.getDate() - 7);

    this.form = new FormGroup({
      dateForm: new FormControl(d, [Validators.required]),
      dateToForm: new FormControl(new Date(), [Validators.required]),
      balanceForm: new FormControl('1000000000', [Validators.required])
    });
  }

  dateToYMD(date): string {
    const d = date.getDate();
    const m = date.getMonth() + 1; // Month from 0 to 11
    const y = date.getFullYear();
    return '' + y + '-' + (m <= 9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
  }

  drawn(): void {

    const fromDate = this.form.controls.dateForm.value;
    const toDate = this.form.controls.dateToForm.value;

    const filteredData = this.data.filter(r => {
      return ((new Date(r.timestamp)) >= fromDate) && ((new Date(r.timestamp)) <= toDate);
    });

    this.myProjection = [];

    let currentBalance = Number(this.myBalance);

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < filteredData.length; i++) {
      const current = filteredData[i];

      const currentReflexion = (Number(currentBalance) * Number(current.burnP));
      currentBalance = currentBalance + currentReflexion;

      this.myProjection.push({
        timestamp: current.timestamp,
        price: current.price,
        burnP: current.burnP,
        reflexion: currentReflexion,
        balance: currentBalance,
        value: current.price * currentBalance
      });

    }

  }

  generate(): void {

    this.myBalance = Number(this.form.controls.balanceForm.value);
    console.log(this.form.controls.dateForm.value);
    console.log(this.form.controls.balanceForm.value);
    if (this.form.valid) {
      this.drawn();
    }

  }

  ngOnInit(): void {

    this.http.get(environment.backend_url + '/safemoon').subscribe((r: any) => {
      this.data = r;
      this.generate();
    });
  }

}
