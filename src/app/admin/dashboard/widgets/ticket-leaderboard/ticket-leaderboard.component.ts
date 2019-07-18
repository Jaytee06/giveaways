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
  getSpent = false;

  constructor(
      private service: TicketService
  ) { }

  ngOnInit() {
    this.changeRange('day');
  }

  getLeaders() {
    this.service.filters.startDateTime = this.range.startDateTime;
    this.service.filters.endDateTime = this.range.endDateTime;
    this.service.filters.getSpent = this.getSpent;
    console.log(this.getSpent);
    this.service.getCounts$().subscribe((d:any[]) => {
      this.leaders = d;
      console.log(d);
    });
  }

  changeRange(r) {
    if( r == 'all' ) {
      this.range = {startDateTime:moment("01/01/2018").startOf('day').format(), endDateTime:moment().add(1, 'day').startOf('day').format()};
    } else {
      this.range = {startDateTime:moment().startOf(r).format(), endDateTime:moment().add(1, r).startOf(r).format()};
    }
    this.getLeaders();
  }

  setValue(e){
    this.getSpent = e.checked;
    this.getLeaders();
  }
}
