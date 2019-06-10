import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { UsersComponent } from './users/users.component';
import {AdminRoutes} from './admin.routing';
import { UserComponent } from './users/user/user.component';
import {SharedModule} from '../core/shared.module';

@NgModule({
  imports: [
      SharedModule,
      RouterModule.forChild(AdminRoutes),
  ],
  declarations: [
      UsersComponent,
      UserComponent,
  ]
})

export class AdminModule {}
