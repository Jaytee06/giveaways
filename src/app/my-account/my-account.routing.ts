import { Routes } from '@angular/router';

import {UserProfileComponent} from "./user-profile.component";

export const MyAccountRoutes: Routes = [{
  path: '',
  redirectTo: 'list',
  pathMatch: 'full',
},{
  path: '',
  children: [{
    path: 'list',
    component: UserProfileComponent
  },]
}];
