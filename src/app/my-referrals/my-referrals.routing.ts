import { Routes } from '@angular/router';

import {MyReferralsComponent} from "./my-referrals.component";

export const MyReferralRoutes: Routes = [{
  path: '',
  redirectTo: 'list',
  pathMatch: 'full',
},{
  path: '',
  children: [{
    path: 'list',
    component: MyReferralsComponent
  },]
}];
