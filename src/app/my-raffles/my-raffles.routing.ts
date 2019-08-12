import { Routes } from '@angular/router';

import {MyRafflesComponent} from "./my-raffles.component";

export const MyRaffleRoutes: Routes = [{
  path: '',
  redirectTo: 'list',
  pathMatch: 'full',
},{
  path: '',
  children: [{
    path: 'list',
    component: MyRafflesComponent
  },]
}];
