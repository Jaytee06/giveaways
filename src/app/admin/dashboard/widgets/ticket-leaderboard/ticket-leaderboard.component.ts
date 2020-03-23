import { Component, OnInit } from '@angular/core';
import {TicketService} from "../../../../services/ticket.service";
import * as moment from "moment";

@Component({
  selector: 'ticket-leaderboard',
  templateUrl: './ticket-leaderboard.component.html',
  styleUrls: ['./ticket-leaderboard.component.scss'],
  providers: [TicketService]
})
export class TicketLeaderboardComponent implements OnInit {

  leaders:any[] = [];
  range: any = {};
  getSpent = true;
  selectedRange: any = 'all';

  updateMinutes = 2;
  leaderTimeout = null;

  constructor(
      private service: TicketService
  ) { }

  ngOnInit() {
    this.changeRange(this.selectedRange);
  }

  getLeaders() {
    this.service.filters.startDateTime = this.range.startDateTime;
    this.service.filters.endDateTime = this.range.endDateTime;
    this.service.filters.getSpent = this.getSpent;

    this.service.getCounts$().subscribe((d:any[]) => {
      this.leaders = d;
      console.log(this.leaders);

      clearTimeout(this.leaderTimeout);
      // this could be triggered many times at once. throttle
      this.leaderTimeout = setTimeout(() => {
        switch (this.selectedRange) {
          case 'day':
            this.selectedRange = 'week';
            break;
          case 'week':
            this.selectedRange = 'month';
            break;
          case 'month':
            this.selectedRange = 'year';
            break;
          case 'year':
            this.selectedRange = 'all';
            break;
          case 'all':
            this.selectedRange = 'day';
            this.getSpent = !this.getSpent;
            break;
        }
        this.changeRange(this.selectedRange);
      }, this.updateMinutes * 60 * 1000);
    });
  }

  changeRange(r) {
    this.selectedRange = r;
    if( this.selectedRange == 'all' ) {
      this.range = {startDateTime:moment("01/01/2018").startOf('day').format(), endDateTime:moment().add(1, 'day').startOf('day').format()};
    } else {
      this.range = {startDateTime:moment().startOf(this.selectedRange).format(), endDateTime:moment().add(1, this.selectedRange).startOf(this.selectedRange).format()};
    }
    this.getLeaders();
  }

  setValue(e){
    this.getSpent = e.checked;
    this.getLeaders();
  }
}
