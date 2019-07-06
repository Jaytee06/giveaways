import {Component, EventEmitter, Input, OnInit} from '@angular/core';

@Component({
  selector: 'count-down-timer',
  templateUrl: './count-down-timer.component.html',
  styleUrls: ['./count-down-timer.component.scss']
})
export class CountDownTimerComponent implements OnInit {

  @Input() structure: any = {};

  constructor() {
  }

  ngOnInit() {

  }

}
