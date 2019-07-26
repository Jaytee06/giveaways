import {Component, EventEmitter, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';

@Component({
  selector: 'count-down-timer',
  templateUrl: './count-down-timer.component.html',
  styleUrls: ['./count-down-timer.component.scss']
})
export class CountDownTimerComponent implements OnInit, OnChanges {

  @Input() structure: any = {};

  audioBeep = new Audio("../../../assets/sounds/Beep.wav");
  audioChime = new Audio("../../../assets/sounds/Chime.wav");

  constructor() {
  }

  ngOnInit() {
    this.audioBeep.load();
    this.audioChime.load();
  }

  ngOnChanges(changes:SimpleChanges) {
    if( changes.structure && changes.structure.currentValue ) {
      if( changes.structure.currentValue.title === 0 )
        this.audioChime.play();
      else if( changes.structure.currentValue.title < 5 )
        this.audioBeep.play();
    }
  }

}
