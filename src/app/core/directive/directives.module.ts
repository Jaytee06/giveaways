import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetDirective } from './widget/widget.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    WidgetDirective
  ],
  exports: [ 
      WidgetDirective
  ]
})
export class DirectivesModule { }
