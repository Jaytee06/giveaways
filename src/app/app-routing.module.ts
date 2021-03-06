import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';

import { MainComponent } from './main/main.component';
import { AuthComponent } from './auth/auth.component';
import { PublicComponent } from './public/public.component';
import {AuthenticatedGuard} from './router-guard/authenticated.guard';

export const AppRoutes: Routes = [{
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
    },
    {
        path: '',
        component: MainComponent,
        children: [{
            path: 'dashboard',
            loadChildren: './dashboard/dashboard.module#DashboardModule'
        }, {
            path: 'pages',
            loadChildren: './blank/blank.module#BlankModule'
        }],
        canActivate: [AuthenticatedGuard],
    },{
        path: '',
        component: MainComponent,
        children: [{
            path: 'games',
            loadChildren: './games/games.module#GamesModule'
        }],
        canActivate: [AuthenticatedGuard]
    },{
        path: '',
        component: MainComponent,
        children: [{
            path: 'raffle',
            loadChildren: './raffle/raffle.module#RaffleModule'
        }],
        canActivate: [AuthenticatedGuard]
    },{
        path: '',
        component: MainComponent,
        children: [{
            path: 'trivia-quiz',
            loadChildren: './trivia/trivia.module#TriviaModule'
        }],
        canActivate: [AuthenticatedGuard]
    },{
        path: '',
        component: MainComponent,
        children: [{
            path: 'my-account',
            loadChildren: './my-account/my-account.module#MyAccountModule'
        }],
        canActivate: [AuthenticatedGuard]
    },{
        path: '',
        component: MainComponent,
        children: [{
            path: 'my-tickets',
            loadChildren: './my-tickets/my-tickets.module#MyTicketsModule'
        }],
        canActivate: [AuthenticatedGuard]
    },{
        path: '',
        component: MainComponent,
        children: [{
            path: 'my-ordered-products',
            loadChildren: './my-ordered-products/my-ordered-products.module#MyOrderedProductsModule'
        }],
        canActivate: [AuthenticatedGuard]
    },{
        path: '',
        component: MainComponent,
        children: [{
            path: 'my-giveaways',
            loadChildren: './my-raffles/my-raffles.module#MyRafflesModule'
        }],
        canActivate: [AuthenticatedGuard]
    },{
        path: '',
        component: MainComponent,
        children: [{
            path: 'my-referrals',
            loadChildren: './my-referrals/my-referrals.module#MyReferralsModule'
        }],
        canActivate: [AuthenticatedGuard]
    },{
        path: '',
        component: MainComponent,
        children: [{
            path: 'help',
            loadChildren: './help/help.module#HelpModule'
        }],
        canActivate: [AuthenticatedGuard]
    },
    {
        path: '',
        component: AuthComponent,
        children: [{
            path: 'session',
            loadChildren: './session/session.module#SessionDemoModule'
        }]
    },{
        path: '',
        component: PublicComponent,
        children: [{
            path: 'blog',
            loadChildren: './blog/blog.module#BlogModule'
        }]
    },
    {
        path: '',
        component: MainComponent,
        children: [{
            path: 'admin',
            loadChildren: './admin/admin.module#AdminModule'
        }],
        canActivate: [AuthenticatedGuard]
    }
];

