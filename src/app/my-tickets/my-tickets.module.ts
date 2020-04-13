import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DirectivesModule } from '../core/directive/directives.module';

import {LibComponentsModule} from "../core/lib-components/lib-components.module";
import {TicketService} from "../services/ticket.service";
import {UserService} from "../services/user.service";
import {MyTicketsComponent} from "./my-tickets.component";
import {TicketRouts} from "./my-tickets.routing";
import {NgPipesModule} from "angular-pipes";
import {DashboardModule} from "../dashboard/dashboard.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        DirectivesModule,
        RouterModule.forChild(TicketRouts),
        LibComponentsModule,
        NgPipesModule,
        DashboardModule
    ],
    declarations: [
        MyTicketsComponent
    ],
    providers: [
        TicketService
    ]
})

export class MyTicketsModule {}
