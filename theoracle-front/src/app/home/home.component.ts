import { Component, OnInit, ViewChild } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

export interface PeriodicElement {
  _id: string;
  timestamp: Date;
  symbol: string;
  name: string;
  price: number;
  pricePercentDailyIndex: number;
  pricePercentWeeklyIndex: number;
  pricePercentMonthlyIndex: number;
  youtubeIndex: number;
  youtubePercentDailyIndex: number;
  youtubePercentWeeklyIndex: number;
  youtubePercentMonthlyIndex: number;
}

const ELEMENT_DATA: PeriodicElement[] = [];

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  displayedColumns: string[] = ['timestamp', 'symbol', 'name', 'youtubeIndex', 'youtubePercentDailyIndex', 'youtubePercentWeeklyIndex', 'youtubePercentMonthlyIndex', 'price', 'pricePercentDailyIndex', 'pricePercentWeeklyIndex', 'pricePercentMonthlyIndex'];
  dataSource;

  @ViewChild(MatSort) sort: MatSort;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {

    this.http.get('http://localhost:3000/reports').subscribe((r: any) => {
      this.dataSource = new MatTableDataSource(r);
      this.dataSource.sort = this.sort;
      this.dataSource.sortingDataAccessor = (data, attribute) => data[attribute];
      console.log(r);
    });
  }

}
