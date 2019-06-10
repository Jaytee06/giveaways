import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DirectivesModule } from '../core/directive/directives.module';

import { BlankComponent } from './blank.component';
import { BlankRoutes } from './blank.routing';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DirectivesModule,
    RouterModule.forChild(BlankRoutes)
  ],
  declarations: [ 
    BlankComponent
  ]
})

export class BlankModule {}
