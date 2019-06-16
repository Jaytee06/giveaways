import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import * as Ps from 'perfect-scrollbar';
import {fadeInAnimation} from "../../../core/route-animation/route.animation";
import {PageTitleService} from "../../../core/page-title/page-title.service";

function getNewTime(d){
  let h = (d.getHours()<10?'0':'') + d.getHours(),
      m = (d.getMinutes()<10?'0':'') + d.getMinutes(),
      s = (d.getSeconds()<10?'0':'') + d.getSeconds(),
      time = h + ":" + m + ":" + s;
  return time;
}

@Component({
  selector: 'ms-dashboard',
  templateUrl:'./admin-dashboard-component.html',
  styleUrls: ['./admin-dashboard-component.scss'],
  encapsulation: ViewEncapsulation.None,
    host: {
        "[@fadeInAnimation]": 'true'
    },
    animations: [ fadeInAnimation ]
})
export class AdminDashboardComponent implements OnInit {

  constructor( private pageTitleService: PageTitleService) {

  }

  ngOnInit() {
    this.pageTitleService.setTitle("Admin Dashboard");
  }

}














