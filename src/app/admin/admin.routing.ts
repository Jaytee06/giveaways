import { Routes } from '@angular/router';

import { UsersComponent } from './users/users.component';
import {UserComponent} from './users/user/user.component';
import {PermissionsComponent} from "./permissions/permissions.component";
import {AuthenticatedGuard} from "../router-guard/authenticated.guard";
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
import {StatusesComponent} from "./statuses/statuses.component";
import {StatusComponent} from "./statuses/status/status.component";
import {TicketOpportunitiesComponent} from "./ticket-opportunities/ticket-opportunities.component";
import {TicketOpportunityComponent} from "./ticket-opportunities/ticket-opportunity/ticket-opportunity.component";
import {ProductsComponent} from "./products/products.component";
import {ProductComponent} from "./products/product/product.component";
import {OrderedProductsComponent} from "./ordered-products/ordered-products.component";
import {OrderedProductComponent} from "./ordered-products/ordered-product/ordered-product.component";
import {GamesComponent} from "./games/games.component";
import {GameComponent} from "./games/game/game.component";
import {PostsComponent} from "./posts/posts.component";
import {PostComponent} from "./posts/status/post.component";

export const AdminRoutes: Routes = [{
  path: '',
  redirectTo: 'loginone',
  pathMatch: 'full',
}, {
    path: '',
    children: [{
        path: 'dashboard',
        component: AdminDashboardComponent,
        canActivate: [AuthenticatedGuard],
    }, {
        path: 'permissions',
        component: PermissionsComponent,
        canActivate: [AuthenticatedGuard],
    }, {
        path: 'permissions/:id',
        component: PermissionComponent,
        canActivate: [AuthenticatedGuard],
    }, {
        path: 'games',
        component: GamesComponent,
        canActivate: [AuthenticatedGuard],
    }, {
        path: 'games/:id',
        component: GameComponent,
        canActivate: [AuthenticatedGuard],
    }, {
        path: 'permissions/new',
        component: PermissionComponent,
        canActivate: [AuthenticatedGuard],
    }, {
        path: 'posts',
        component: PostsComponent,
        canActivate: [AuthenticatedGuard],
    }, {
        path: 'posts/:id',
        component: PostComponent,
        canActivate: [AuthenticatedGuard],
    }, {
        path: 'posts/new',
        component: PostComponent,
        canActivate: [AuthenticatedGuard],
    }, {
        path: 'products',
        component: ProductsComponent,
        canActivate: [AuthenticatedGuard],
    }, {
        path: 'products/:id',
        component: ProductComponent,
        canActivate: [AuthenticatedGuard],
    }, {
        path: 'products/new',
        component: ProductComponent,
        canActivate: [AuthenticatedGuard],
    }, {
        path: 'ordered-products',
        component: OrderedProductsComponent,
        canActivate: [AuthenticatedGuard],
    }, {
        path: 'ordered-products/:id',
        component: OrderedProductComponent,
        canActivate: [AuthenticatedGuard],
    }, {
        path: 'ordered-products/new',
        component: OrderedProductComponent,
        canActivate: [AuthenticatedGuard],
    }, {
        path: 'raffles',
        component: RafflesComponent,
        canActivate: [AuthenticatedGuard],
    }, {
        path: 'raffles/:id',
        component: RaffleComponent,
        canActivate: [AuthenticatedGuard],
    }, {
        path: 'raffles/new',
        component: RaffleComponent,
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
        path: 'statuses',
        component: StatusesComponent,
        canActivate: [AuthenticatedGuard],
    }, {
        path: 'statuses/:id',
        component: StatusComponent,
        canActivate: [AuthenticatedGuard],
    }, {
        path: 'statuses/new',
        component: StatusComponent,
        canActivate: [AuthenticatedGuard],
    }, {
        path: 'tickets',
        component: TicketsComponent,
        canActivate: [AuthenticatedGuard],
    }, {
        path: 'tickets/:id',
        component: TicketComponent,
        canActivate: [AuthenticatedGuard],
    }, {
        path: 'tickets/new',
        component: TicketComponent,
        canActivate: [AuthenticatedGuard],
    }, {
        path: 'ticket-opportunities',
        component: TicketOpportunitiesComponent,
        canActivate: [AuthenticatedGuard],
    }, {
        path: 'ticket-opportunities/:id',
        component: TicketOpportunityComponent,
        canActivate: [AuthenticatedGuard],
    }, {
        path: 'ticket-opportunities/new',
        component: TicketOpportunityComponent,
        canActivate: [AuthenticatedGuard],
    }, {
        path: 'trivias',
        component: TriviasComponent,
        canActivate: [AuthenticatedGuard],
    }, {
        path: 'trivias/:id',
        component: TriviaComponent,
        canActivate: [AuthenticatedGuard],
    }, {
        path: 'trivias/new',
        component: TriviaComponent,
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
