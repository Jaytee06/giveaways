import { Routes } from '@angular/router';

import {MyTicketsComponent} from "./my-tickets.component";

export const TicketRouts: Routes = [{
  path: '',
  redirectTo: 'list',
  pathMatch: 'full',
},{
  path: '',
  children: [{
    path: 'list',
    component: MyTicketsComponent
  },]
}];
