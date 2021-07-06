import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
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
import { SafemoonComputeComponent } from './safemoon-compute/safemoon-compute.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { BTCComponent } from './btc/btc.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CoinComponent,
    SafemoonComponent,
    ArrayNumberComponent,
    SafemoonComputeComponent,
    BTCComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTableModule,
    HttpClientModule,
    MatSortModule,
    FormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatNativeDateModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
