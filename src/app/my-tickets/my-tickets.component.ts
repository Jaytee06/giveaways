import {Component, OnInit} from '@angular/core';
import {UserService} from "../services/user.service";
import {combineLatest, of} from "rxjs";
import {TicketService} from "../services/ticket.service";

@Component({
	selector: 'my-tickets',
	templateUrl: './my-tickets-component.html',
	styleUrls: ['./my-tickets-component.scss'],
	providers:[TicketService]
})
export class MyTicketsComponent implements OnInit {

	tickets:any[] = [];
	user:any = {};
	querySkip = 0;
	queryLimit = 10;
	windowWidth = window.innerWidth;

	constructor(
		private service: TicketService,
		private userService: UserService,
	) {}

	ngOnInit() {

		const user$ = this.userService.getCurrentUser();
		combineLatest(user$).subscribe((data) => {
			[this.user] = data;
			this.getTickets();
		});
	}

	getMoreTickets() {
		this.querySkip += this.queryLimit;
		this.getTickets();
	}

	getTickets() {
		this.service.filters.user = this.user._id;
		this.service.filters.skip = this.querySkip;
		this.service.filters.limit = this.queryLimit;
		this.service.filters.getSpent = true;
		this.service.get$().subscribe((d:any[]) => {
			d = d.map((t) => {
				t.createdAt = this.service.formatDate(t.createdAt, true);
				return t;
			});
			this.tickets = this.tickets.concat(d);
		});
	}
}














