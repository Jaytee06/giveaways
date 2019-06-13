import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { UsersComponent } from './users/users.component';
import {AdminRoutes} from './admin.routing';
import { UserComponent } from './users/user/user.component';
import {SharedModule} from '../core/shared.module';
import {PermissionsComponent} from "./permissions/permissions.component";
import {PermissionComponent} from "./permissions/permission/permission.component";
import {RolesComponent} from "./roles/roles.component";
import {RoleComponent} from "./roles/role/role.component";

@NgModule({
  imports: [
      SharedModule,
      RouterModule.forChild(AdminRoutes),
  ],
  declarations: [
      UsersComponent,
      UserComponent,
      PermissionsComponent,
      PermissionComponent,
      RolesComponent,
      RoleComponent
  ]
})

export class AdminModule {}
