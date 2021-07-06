import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CoinComponent } from './coin/coin.component';
import { SafemoonComponent } from './safemoon/safemoon.component';
import { SafemoonComputeComponent } from './safemoon-compute/safemoon-compute.component';
import { BTCComponent } from './btc/btc.component';

const routes: Routes = [
  { path: 'reports', component: HomeComponent },
  { path: 'coin/:id', component: CoinComponent },
  { path: 'safemoon', component: SafemoonComponent },
  { path: 'btc', component: BTCComponent },

  { path: '', component: SafemoonComputeComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
