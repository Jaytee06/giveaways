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
import {TriviasComponent} from "./trivias/trivias.component";
import {TriviaComponent} from "./trivias/trivia/trivia.component";
import {AdminDashboardComponent} from "./dashboard/admin-v1/admin-dashboard.component";
import {RafflesComponent} from "./raffels/raffles.component";
import {RaffleComponent} from "./raffels/raffle/raffle.component";
import {TicketLeaderboardComponent} from "./dashboard/widgets/ticket-leaderboard/ticket-leaderboard.component";
import {StatusComponent} from "./statuses/status/status.component";
import {StatusesComponent} from './statuses/statuses.component';
import {TicketOpportunityComponent} from "./ticket-opportunities/ticket-opportunity/ticket-opportunity.component";
import {TicketOpportunitiesComponent} from "./ticket-opportunities/ticket-opportunities.component";
import {ProductsComponent} from "./products/products.component";
import {ProductComponent} from "./products/product/product.component";
import {OrderedProductsComponent} from "./ordered-products/ordered-products.component";
import {OrderedProductComponent} from "./ordered-products/ordered-product/ordered-product.component";
import {GamesComponent} from "./games/games.component";
import {GameComponent} from "./games/game/game.component";

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
      TriviaComponent,
      RafflesComponent,
      RaffleComponent,
      TicketLeaderboardComponent,
      StatusesComponent,
      StatusComponent,
      TicketOpportunityComponent,
      TicketOpportunitiesComponent,
      ProductsComponent,
      ProductComponent,
      OrderedProductsComponent,
      OrderedProductComponent,
      GamesComponent,
      GameComponent
  ]
})

export class AdminModule {}
