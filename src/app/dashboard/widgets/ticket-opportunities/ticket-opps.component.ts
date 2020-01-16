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
	stickyTicketOpps = [];
	user: any;

	constructor(private service: UserService, private ticketService: TicketService) {}

	ngOnInit() {

		// clear below settings
		delete this.ticketService.filters.user;
		delete this.ticketService.filters.ticketOpps;

		this.ticketService.filters.liveDuringTime = moment().format();
		const ticketOpps$ = this.ticketService.getOpportunities$();
		const user$ = this.service.getCurrentUser();

		combineLatest(ticketOpps$, user$).subscribe((data) => {
			let ticketOpps;
			[ticketOpps, this.user] = data;

			// clear above filters
			delete this.ticketService.filters.liveDuringTime;

			this.ticketService.filters.user = this.user._id;
			this.ticketService.filters.ticketOpps = this.ticketOpps.map(x => x._id);
			const redeemed$ = this.ticketService.get$();
			const subscribed$ = this.service.checkSubscription(this.user._id);

			combineLatest(redeemed$, subscribed$).subscribe((d) => {
				let redeemedTicketOpps;
				[redeemedTicketOpps, this.user.isSubscribed] = d;

				redeemedTicketOpps.forEach((rOpp) => {
					let op = ticketOpps.find(x => x._id === rOpp.ref);
					if( op ) {
						if( !op.howOften || op.howOften === 'once' ) {
							op.redeemed = true;
						} else {
							if( moment(rOpp.createdAt).isAfter(moment().subtract(1, op.howOften)) ) {
								op.redeemed = true;
							}
						}
					}
				});

				this.ticketOpps = ticketOpps.filter(x => !x.sticky);
				this.stickyTicketOpps = ticketOpps.filter(x => x.sticky).sort((a, b) => a.amount - b.amount);
			});

		});
	}

	opSelected(op) {
		if( op.refLink )
			window.open(op.refLink, "_blank");
	}
}














