import { Routes } from '@angular/router';

import {TriviaComponent} from "./trivia.component";

export const TriviaRoutes: Routes = [{
  path: '',
  redirectTo: ':id',
  pathMatch: 'full',
},{
  path: '',
  children: [{
    path: ':id',
    component: TriviaComponent
  },]
}];
