import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UserService} from "../../../services/user.service";
import {TicketService} from "../../../services/ticket.service";

import * as moment from 'moment';
import {combineLatest} from "rxjs";

@Component({
	selector: 'ticket-opps-widget',
	templateUrl: './ticket-opps-component.html',
	styleUrls: ['./ticket-opps-component.scss'],
})
export class TicketOppsComponent implements OnInit {

	@Input() signalUpdate:any;
	@Output() didUpdateData:EventEmitter<any> = new EventEmitter<any>();

	ticketOpps = [];
	user: any;

	constructor(private service: UserService, private ticketService: TicketService) {}

	ngOnInit() {
		this.ticketService.filters.liveDuringTime = moment().format();
		const ticketOpps$ = this.ticketService.getOpportunities$();
		const user$ = this.service.getCurrentUser();

		combineLatest(ticketOpps$, user$).subscribe((data) => {
			[this.ticketOpps, this.user] = data;

			this.service.checkSubscription(this.user._id).subscribe((d) => {
				this.user.isSubscribed = d;
			});

		});
	}
}














