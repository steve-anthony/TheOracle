import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { HomeComponent } from './home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { MatSortModule } from '@angular/material/sort';
import { CoinComponent } from './coin/coin.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { ArrayNumberComponent } from './shared/array-number/array-number.component';
import { SafemoonComponent } from './safemoon/safemoon.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CoinComponent,
    SafemoonComponent,
    ArrayNumberComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTableModule,
    HttpClientModule,
    MatSortModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
