import { Routes } from '@angular/router';
import {HiwComponent} from "./how-it-works/hiw.component";

export const RaffleRoutes: Routes = [{
  path: '',
  redirectTo: 'how-it-works',
  pathMatch: 'full',
}, {
  path: '',
  children: [{
    path: 'how-it-works',
    component: HiwComponent
  }]
}];
