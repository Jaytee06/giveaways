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
import {TicketsComponent} from "./tickets/tickets.component";
import {TicketComponent} from "./tickets/ticket/ticket.component";
import {TriviasComponent} from "./trivia/trivias.component";
import {TriviaComponent} from "./trivia/trivia/trivia.component";
import {AdminDashboardComponent} from "./dashboard/admin-v1/admin-dashboard.component";

@NgModule({
  imports: [
      SharedModule,
      RouterModule.forChild(AdminRoutes),
  ],
  declarations: [
      UsersComponent,
      UserComponent,
      AdminDashboardComponent,
      PermissionsComponent,
      PermissionComponent,
      RolesComponent,
      RoleComponent,
      TicketsComponent,
      TicketComponent,
      TriviasComponent,
      TriviaComponent
  ]
})

export class AdminModule {}
