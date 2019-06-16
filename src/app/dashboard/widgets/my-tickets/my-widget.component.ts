import {Component, OnInit} from '@angular/core';
import {UserService} from "../../../services/user.service";
import {TicketService} from "../../../services/ticket.service";

@Component({
	selector: 'my-tickets-widget',
	templateUrl: './my-tickets-component.html',
	styleUrls: ['./my-tickets-component.scss'],
})
export class MyWidgetComponent implements OnInit {

	user;
	ticketCount = 0;

	constructor(private service: TicketService, private userService: UserService) {

	}

	ngOnInit() {
		this.userService.getCurrentUser().subscribe((user) => {
			this.user = user;
			this.service.myTickets(this.user._id).subscribe((data) => {
				this.ticketCount = data[0].count;
				console.log(this.ticketCount);
			});
		});
	}

}














