import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DirectivesModule } from '../core/directive/directives.module';

import { DashboardComponent } from './dashboard-v1/dashboard.component';
import { DashboardRoutes } from './dashboard.routing';
import {MyWidgetComponent} from "./widgets/my-tickets/my-widget.component";
import {LibComponentsModule} from "../core/lib-components/lib-components.module";
import {TicketService} from "../services/ticket.service";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DirectivesModule,
    RouterModule.forChild(DashboardRoutes),
      LibComponentsModule
  ],
  declarations: [ 
    DashboardComponent,
    MyWidgetComponent
  ],
  providers: [
      TicketService
  ]
})

export class DashboardModule {}
