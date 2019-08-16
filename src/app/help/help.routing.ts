import { Routes } from '@angular/router';
import {HiwComponent} from "./how-it-works/hiw.component";
import {LtpComponent} from "./link-to-prime/ltp.component";
import {HtsComponent} from "./how-to-subscribe/hts.component";

export const RaffleRoutes: Routes = [{
  path: '',
  redirectTo: 'how-it-works',
  pathMatch: 'full',
},
  {
    path: '',
    children: [{
      path: 'how-it-works',
      component: HiwComponent
    }, {
      path: 'link-to-prime',
      component: LtpComponent
    }, {
      path: 'how-to-subscribe',
      component: HtsComponent
    }]
  }
 ];
