import { Routes } from '@angular/router';

import { UsersComponent } from './users/users.component';
import {UserComponent} from './users/user/user.component';
import {PermissionsComponent} from "./permissions/permissions.component";
import {AuthenticatedGuard} from "../router-guard/authenticated.guard";
import {PermissionComponent} from "./permissions/permission/permission.component";
import {RolesComponent} from "./roles/roles.component";
import {RoleComponent} from "./roles/role/role.component";

export const AdminRoutes: Routes = [{
  path: '',
  redirectTo: 'loginone',
  pathMatch: 'full',
}, {
    path: '',
    children: [{
        path: 'permissions',
        component: PermissionsComponent,
        canActivate: [AuthenticatedGuard],
    }, {
        path: 'permissions/:id',
        component: PermissionComponent,
        canActivate: [AuthenticatedGuard],
    }, {
        path: 'permissions/new',
        component: PermissionComponent,
        canActivate: [AuthenticatedGuard],
    }, {
        path: 'roles',
        component: RolesComponent,
        canActivate: [AuthenticatedGuard],
    }, {
        path: 'roles/:id',
        component: RoleComponent,
        canActivate: [AuthenticatedGuard],
    }, {
        path: 'roles/new',
        component: RoleComponent,
        canActivate: [AuthenticatedGuard],
    }, {
        path: 'users',
        component: UsersComponent,
        canActivate: [AuthenticatedGuard],
    }, {
        path: 'users/:id',
        component: UserComponent,
        canActivate: [AuthenticatedGuard],
    }, {
        path: 'users/new',
        component: UserComponent,
        canActivate: [AuthenticatedGuard],
    }]
}];
