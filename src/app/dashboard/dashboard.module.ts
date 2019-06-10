import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DirectivesModule } from '../core/directive/directives.module';

import { DashboardComponent } from './dashboard-v1/dashboard.component';
import { DashboardRoutes } from './dashboard.routing';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DirectivesModule,
    RouterModule.forChild(DashboardRoutes)
  ],
  declarations: [ 
    DashboardComponent
  ]
})

export class DashboardModule {}
