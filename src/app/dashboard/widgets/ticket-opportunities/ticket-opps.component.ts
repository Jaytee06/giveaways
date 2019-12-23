import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UserService} from "../../../services/user.service";
import {TicketService} from "../../../services/ticket.service";

import * as moment from 'moment';

@Component({
	selector: 'ticket-opps-widget',
	templateUrl: './ticket-opps-component.html',
	styleUrls: ['./ticket-opps-component.scss'],
})
export class TicketOppsComponent implements OnInit {

	@Input() signalUpdate:any;
	@Output() didUpdateData:EventEmitter<any> = new EventEmitter<any>();

	ticketOpps = [];

	constructor(private service: UserService, private ticketService: TicketService) {}

	ngOnInit() {
		this.ticketService.filters.liveDuringTime = moment().format();
		this.ticketService.getOpportunities$().subscribe((ticketOpps:any[]) => {
			this.ticketOpps = ticketOpps;
		});
	}
}














