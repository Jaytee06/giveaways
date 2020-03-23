import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import {fadeInAnimation} from "../core/route-animation/route.animation";
import {PageTitleService} from "../core/page-title/page-title.service";
import {UserService} from "../services/user.service";
import {combineLatest} from "rxjs";
import {TicketService} from "../services/ticket.service";
import {RaffleService} from "../services/raffle.service";
import {environment} from "../../environments/environment";

@Component({
    selector: 'ms-user-profile',
    templateUrl:'./user-profile-component.html',
    styleUrls: ['./user-profile-component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: {
        "[@fadeInAnimation]": 'true'
    },
    animations: [ fadeInAnimation ]
})
export class UserProfileComponent implements OnInit {

  user;
  editing = false;
  earnedTickets: 0;
  tickets: 0;
    rewarded:0;
    states = [];
    copyUser = {};

  constructor(private pageTitleService: PageTitleService, private service: UserService, private ticketService: TicketService, private raffleService: RaffleService) {
  }

  ngOnInit() {
    this.pageTitleService.setTitle("");

      this.states = this.service.getStates();

    this.ticketService.filters.user = this.service.userId;
    this.raffleService.filters.winner = this.service.userId;
    const user$ = this.service.getCurrentUser();
    const tickets$ = this.ticketService.getCounts$();
    const rewarded$ = this.raffleService.get$();

    combineLatest([user$, tickets$, rewarded$]).subscribe(data => {
        let earnedTickets, rewarded;
      [this.user, earnedTickets, rewarded] = data;

        this.earnedTickets = earnedTickets[0].count;

        this.rewarded = rewarded.reduce((c, t) => {
            c += t.monetaryValue || 0;
            return c;
        }, 0);

        this._fixUser();

      this.ticketService.filters.getSpent = true;
      this.ticketService.getCounts$().subscribe((tickets:any) => {
          this.tickets = tickets[0].count;
      });
    });
  }

  saveDetails() {

      if( this.user.password && this.user.repeatPassword != this.user.password ) {
          this.service.throwError('error', 'Passwords do not match');
          return;
      } else if( this.user.password ) {
          delete this.user.repeatPassword;
      }

      this.user.fullname = (this.user.firstName || '')+' '+(this.user.lastName || '');
      delete this.user.firstName;
      delete this.user.lastName;
      this.service.updateUser(this.user).subscribe((data) => {
          this.service.success('Profile Updated');
          this.user = data;
          this._fixUser();
          this.editing = false;
      });
  }

  cancel() {
      this.user = JSON.parse(JSON.stringify(this.copyUser));
      this.editing = false;
  }

    link(type) {
      if( type == 'twitch' ) {
          window.location.href = environment.apiBaseUrl + '/api/auth/twitch';
          this.user.requesting = 'twitch';
          this.service.updateUser(this.user).subscribe(() => {});
      }
    }

  private _fixUser() {
      const name = this.user.fullname.split(' ');
      this.user.firstName = name[0];
      this.user.lastName = name[1];

      if( !this.user.address ) this.user.address = {};
      if( !this.user.address.shipping ) this.user.address.shipping = {};

      this.copyUser = JSON.parse(JSON.stringify(this.user));
  }
}



