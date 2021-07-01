import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CoinComponent } from './coin/coin.component';
import { SafemoonComponent } from './safemoon/safemoon.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'coin/:id', component: CoinComponent },
  { path: 'safemoon', component: SafemoonComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
