import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DirectivesModule } from '../core/directive/directives.module';

import {LibComponentsModule} from "../core/lib-components/lib-components.module";
import {UserService} from "../services/user.service";
import {RaffleComponent} from "./raffle.component";
import {RaffleRoutes} from "./raffle.routing";
import {NgPipesModule} from "angular-pipes";
import {RaffleService} from "../services/raffle.service";
import {RaffleTicketsDialogComponent} from "./dialog/raffle-tickets-dialog/raffle-tickets-dialog.component";
import {TicketService} from "../services/ticket.service";
import {DashboardModule} from "../dashboard/dashboard.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        DirectivesModule,
        RouterModule.forChild(RaffleRoutes),
        LibComponentsModule,
        NgPipesModule,
        DashboardModule,
    ],
    declarations: [
        RaffleComponent,
        RaffleTicketsDialogComponent
    ],
    entryComponents:[
        RaffleTicketsDialogComponent
    ],
    providers: [
        RaffleService,
        UserService,
        TicketService
    ]
})

export class RaffleModule {}
