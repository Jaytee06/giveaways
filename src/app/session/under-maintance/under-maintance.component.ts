import { Component, OnInit } from '@angular/core';
import { PageTitleService } from '../../core/page-title/page-title.service';
import {fadeInAnimation} from "../../core/route-animation/route.animation";

@Component({
    selector: 'ms-under-maintance',
    templateUrl: './under-maintance.component.html',
    styleUrls: ['./under-maintance.component.scss'],
    host: {
        "[@fadeInAnimation]": 'true'
    },
    animations: [ fadeInAnimation ]
})
export class UnderMaintanceComponent implements OnInit {

  constructor(private pageTitleService: PageTitleService) { }

  ngOnInit() {
  	this.pageTitleService.setTitle("Under Maintance");
  }

}
