import { Component, OnInit } from '@angular/core';
import { PageTitleService } from '../../core/page-title/page-title.service';
import {fadeInAnimation} from "../../core/route-animation/route.animation";

@Component({
    selector: 'ms-subscribes',
    templateUrl: './subscribes.component.html',
    styleUrls: ['./subscribes.component.scss'],
    host: {
        "[@fadeInAnimation]": 'true'
    },
    animations: [ fadeInAnimation ]
})
export class SubscribesComponent implements OnInit {

  constructor(private pageTitleService: PageTitleService) { }

  ngOnInit() {
  	this.pageTitleService.setTitle("Subscribes");
  }

}
