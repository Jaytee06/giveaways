import { Routes } from '@angular/router';

import { UsersComponent } from './users/users.component';
import {UserComponent} from './users/user/user.component';

export const AdminRoutes: Routes = [{
  path: '',
  redirectTo: 'loginone',
  pathMatch: 'full',
}, {
    path: '',
    children: [{
        path: 'users',
        component: UsersComponent,
    }, {
        path: 'users/:id',
        component: UserComponent
    }, {
        path: 'users/new',
        component: UserComponent
    }]
}];
