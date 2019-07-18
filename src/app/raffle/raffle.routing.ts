import { Routes } from '@angular/router';

import {RaffleComponent} from "./raffle.component";

export const RaffleRoutes: Routes = [{
  path: '',
  redirectTo: ':id',
  pathMatch: 'full',
}, {
  path: '',
  children: [{
    path: ':id',
    component: RaffleComponent
  }]
}];
