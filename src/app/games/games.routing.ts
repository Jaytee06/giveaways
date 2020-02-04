import { Routes } from '@angular/router';

import {GamesComponent} from "./games.component";
import {GameComponent} from "./game/game.component";

export const GamesRoutes: Routes = [{
  path: '',
  redirectTo: 'list',
  pathMatch: 'full',
}, {
  path: '',
  children: [
      {
          path: 'list',
          component: GamesComponent
      },{
          path: ':id',
          component: GameComponent
      },
  ]
}];
