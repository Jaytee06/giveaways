import { Routes } from '@angular/router';

import { BlankComponent } from './blank.component';

export const BlankRoutes: Routes = [{
  path: '',
  redirectTo: 'blank',
  pathMatch: 'full',
},{
  path: '',
  children: [{
    path: 'blank',
    component: BlankComponent
  }]
}];
