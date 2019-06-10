import { Directive, ElementRef, OnInit } from '@angular/core';
import 'widgster';
declare var jQuery: any;

@Directive({
  selector: '[widget]'
})
export class WidgetDirective implements OnInit{

   $el: any;

  constructor(el: ElementRef) {
    this.$el = jQuery(el.nativeElement);
    jQuery.fn.widgster.Constructor.DEFAULTS.bodySelector = '.widget-body';

    jQuery(document).on('close.widgster', (e) => {
      let $colWrap = jQuery(e.target).closest(' [class*="col-"]:not(.widget-container)');
      if (!$colWrap.find('.widget').not(e.target).length) {
        $colWrap.remove();
      }
    });

    jQuery(document).on("fullscreened.widgster", (e) => {
        jQuery(e.target).find('div.widget-body').addClass('card-block-scrolling');
    }).on("restored.widgster", (e) => {
        jQuery(e.target).find('div.widget-body').removeClass('card-block-scrolling');
    }); 
  }

  ngOnInit(): void {
    this.$el.widgster();
  }

}
