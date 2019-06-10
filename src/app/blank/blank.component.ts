import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PageTitleService } from '../core/page-title/page-title.service';
import {fadeInAnimation} from "../core/route-animation/route.animation";
import * as Ps from 'perfect-scrollbar';

@Component({
  selector: 'ms-blank',
  templateUrl:'./blank-component.html',
  styleUrls: ['./blank-component.scss'],
  encapsulation: ViewEncapsulation.None,
    host: {
        "[@fadeInAnimation]": 'true'
    },
    animations: [ fadeInAnimation ]
})
export class BlankComponent implements OnInit {

  constructor( private pageTitleService: PageTitleService) {

  }

  ngOnInit() {
    this.pageTitleService.setTitle("Blank");
  }

}














